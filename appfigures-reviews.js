module.exports = function (robot) {
    var username = process.env.HUBOT_AF_USERNAME,
        password = process.env.HUBOT_AF_PASSWORD,
        clientKey = process.env.HUBOT_AF_CLIENT_KEY;

    // For testing locally, use `export HUBUT_AF_USERNAME=...` for current session
    if (!username) console.log('WARNING HUBOT_AF_USERNAME environment variable not set');
    if (!password) console.log('WARNING HUBOT_AF_PASSWORD environment variable not set');
    if (!clientKey) console.log('WARNING HUBOT_AF_CLIENT_KEY environment variable not set');

    if (!username || !password || !clientKey) {
        console.log('appFigures reviews disabled');
        return;
    }

    var bot = require('./libs/bot')({
        username: username,
        password: password,
        clientKey: clientKey
    });

    robot.hear(bot.regexp(), function (msg) {
        bot.parse(msg.match, function (out) {
            msg.send(out);
        });
    });
};