function toStarsString(rating) {
    var str = '', i;

    rating = Math.round(rating);

    for (i = 0; i < rating; ++i) str += '★';
    for (i = 0; i < (5 - rating); ++i) str += '☆';

    return str;
}


module.exports = function (robot) {

    var moment = require('moment'),
        afApi = require('./libs/appfigures-api'),
        // timespan = require('./libs/timespan'),
        // lang = require('./libs/lang'),
        username = process.env.HUBOT_AF_USERNAME,
        password = process.env.HUBOT_AF_PASSWORD,
        clientKey = process.env.HUBOT_AF_CLIENT_KEY,
        dateFormat = 'YYYY-MM-DD',
        af;

    // For testing locally, use `export HUBUT_AF_USERNAME=...` for current session

    if (!username) console.log('WARNING HUBOT_AF_USERNAME environment variable not set');
    if (!password) console.log('WARNING HUBOT_AF_PASSWORD environment variable not set');
    if (!clientKey) console.log('WARNING HUBOT_AF_CLIENT_KEY environment variable not set');

    if (!username || !password || !clientKey) {
        console.log('appFigures reviews disabled');
        return;
    }

    af = afApi(username, password, clientKey);

    //robot.respond(/(\d+ )?reviews( in (\w+))?( from (.*))?/i, function (msg) {
    robot.respond(/reviews/i, function (msg) {
        var params = {
            count: 6
        },
        count = msg.match[1],
        langName = msg.match[3],
        date = msg.match[5];

        if (date) {
            var span = timespan(date);
            params.start = span.start().format(dateFormat);
            params.end = span.end().format(dateFormat);
        }
        if (count) {
            params.count = count;
        }
        if (langName) {
            params.lang = lang.toCode(langName);
        }

        af.request('/reviews', {
            params: params
        }).then(function (data) {
            var out = '';

            out += data.reviews.length + ' OUT OF ' + data.total + ' TOTAL REVIEWS\n\n';

            out += data.reviews.map(function (review) {
                return toStarsString(review.stars) + review.title + ' - ' + review.review +
                    '\n- ' + moment(review.date).fromNow();
            }).join('\n\n');

            msg.send(out);
        }, function (error) {
            msg.send('There was an error: ' + error);
        });
    });
};