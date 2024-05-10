const logger = require("../../logger");

exports.loggerResponse = (type, message, res) => {
    if (type === "error") {
        logger.error(message, res);
    } else if(type === "warn"){
        logger.warn(message);
    }else{
        logger.info(message);
    }
}