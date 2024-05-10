const aws = require('aws-sdk');

const spacesEndpoint = new aws.Endpoint(process.env.ENDPOINTHTTP);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_KEY,
    signatureVersion: 'v4'
});

const setUpCorsOnS3 = async () => {
    try {
        const corsParams = {
            Bucket: process?.env?.SPACENAME,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedOrigins: ['*'],
                        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                        AllowedHeaders: ['*'],
                        MaxAgeSeconds: 3000
                    }
                ]
            }
        };
        await s3.putBucketCors(corsParams).promise();
        return true
    } catch (error) {
        return false
    }
}

const checkS3Connection = async () => {
    try {
        await s3.listBuckets().promise()
        return true
    } catch (error) {
        return false
    }
}

module.exports = {
    s3,
    checkS3Connection,
    setUpCorsOnS3
}
