require('dotenv').config();

const express = require('express');
const http = require('http');
const https = require('https');
const app = express();
const fs = require("fs");

const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./src/app/router/index.js');

const swaggerOptions = require('./src/app/swagger/index.js');
const { initcron } = require('./src/app/cron/index.js');
const { connectToDb } = require('./src/app/config/db/config.js');
const { loggerResponse } = require('./src/app/helpers/logger/response.js');
const { checkS3Connection, setUpCorsOnS3 } = require('./src/app/config/aws/config.js');

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: true }));

app.use(routes);
app.use(swaggerOptions);

let httpsOptions = null;

if (process.env.NODE_ENV === 'production') {
    const certFilePath = `${process.env.SSLPATH}`;
    const caBundleFilePath = `${process.env.SSLPATH}`;
    const keyFilePath = `${process.env.SSLPATH}`;

    httpsOptions = {
        cert: fs.existsSync(certFilePath) ? fs.readFileSync(certFilePath) : null,
        ca: fs.existsSync(caBundleFilePath) ? fs.readFileSync(caBundleFilePath) : null,
        key: fs.existsSync(keyFilePath) ? fs.readFileSync(keyFilePath) : null
    };
}
const httpServer = http.createServer(app);
const httpsServer = httpsOptions?.cert && httpsOptions?.key ? https.createServer(httpsOptions, app) : null;

async function startServer(protocol, port) {
    const server = protocol === 'http' ? httpServer : httpsServer || httpServer;
    const serverListener = (server, protocol, message) => server.listen(port, message, () => {
        const { address: host, port } = server.address();
        console.log(`App listening at ${protocol}://${host}:${port}`);
    });

    if (process.env.CLIENT_HOST === 'localhost' || process.env.CLIENT_HOST === 'development' || process.env.CLIENT_HOST === 'production') {
        serverListener(server, protocol, process.env.CLIENT_HOST);
    } else {
        serverListener(server, protocol, () => console.log(`App listening at ${protocol}:/:${port}`));
    }
    const isDbConnected = await connectToDb();
    const isS3Connected = await checkS3Connection();
    if (isS3Connected) {
        await setUpCorsOnS3()
        loggerResponse("info", "Cros Policy allowed for all in S3")
    }

    if (isDbConnected) {
        initcron();
        loggerResponse("info", "CronJobs activated")
    } else {
        loggerResponse("warn", "Data Base not connected & CronJobs not activated")
    }

    server.on('error', (error) => console.error('Server error:', error));
    return server;
}

const httpPort = process.env.HTTP_PORT;
const httpsPort = process.env.HTTPS_PORT;

const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
const port = process.env.NODE_ENV === 'development' ? httpPort : httpsPort;
;

startServer(protocol, port);