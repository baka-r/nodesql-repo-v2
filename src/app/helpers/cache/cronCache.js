const NodeCache = require("node-cache");
const cache = new NodeCache();


exports.setCronToken = (jobKey) => {
    cache.set(jobKey, true);
}

exports.getCronToken = (jobKey) => {
    cache.get(jobKey)
}

exports.delCronToken = (jobKey) => {
    cache.del(jobKey)
}