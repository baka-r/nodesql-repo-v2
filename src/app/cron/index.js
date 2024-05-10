
const job = require("node-cron")

const processPlaylistCron = async () => {
    try {
        loggerResponse("info", "Process Playlist Cron Activated Only for Mid Night");
        job.schedule("0 0 * * *", async () => {
            try {
                const cacheExpired = isCacheExpired(`${player?.player_identifier}_request_data`);
                const jobKey = `jobRunning`;

                if (getCronToken(jobKey) || !cacheExpired) {
                    if (!cacheExpired) {
                        loggerResponse("info", `Cache not expired for ${player.player_identifier}. Skipping this execution.`);
                    } else {
                        loggerResponse("info", `Previous job for ${player.player_identifier} still running. Skipping this execution.`);
                    }
                    return;
                }
                setCronToken(jobKey);
                try {

                    loggerResponse("info", `hello}`);
                } finally {
                    delCronToken(jobKey);
                }

            } catch (error) {
                loggerResponse("error", "error in processPlaylistCron()", error);
            }
        });
    } catch (error) {
        loggerResponse("error", "error in processPlaylistCron()", error);
    }
};

exports.initcron = () => {
    processPlaylistCron()
    processClearPublic()
}