const NodeCache = require("node-cache");
const cache = new NodeCache();


exports.cacheData = (key, value) => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);

    const timeRemaining = midnight.getTime() - now.getTime();
    const ttlSeconds = Math.ceil(timeRemaining / 1000);

    cache.set(key, value, ttlSeconds);
}

exports.retrieveCache = (key) => {
    const data = cache.get(key);
    return data
}

exports.deleteCache = (key) => {
    cache.del(key);
}

exports.retrieveCacheKeys = () => {
    const keys = cache.keys();
    return keys;
}

exports.isCacheExpired = (key) => {
    const stats = cache.getStats();
    const cachedData = stats.keys[key];
    if (cachedData && cachedData.expireTimestamp <= Date.now()) {
        return true; // Cache entry is expired
    }
    return false; // Cache entry is not expired or doesn't exist
}