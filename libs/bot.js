var parser = require('./parser'),
    moment = require('moment');

function toStarsString(rating) {
    var str = '', i;

    rating = Math.round(rating);

    for (i = 0; i < rating; ++i) str += '★';
    for (i = 0; i < (5 - rating); ++i) str += '☆';

    return str;
}

function renderReview(review) {
    return toStarsString(review.stars) + review.title + ' - ' + review.review +
                        '\n- ' + moment(review.date).fromNow();
}

module.exports = function (credentials) {

    var client = require('./client')(credentials);

    return {
        parse: function (input, respondFn) {
            var errors = [];
            var params = parser.parse(input, {unmatchedTokens: errors});

            if (errors.length > 0) {
                respondFn(['I didn\'t understand these:', errors.join(', '), 'but I\'ll give it a try'].join(' '));
            }

            client.reviews(params).then(function (data) {
                var out = '';

                out += data.reviews.length + ' OUT OF ' + data.total + ' TOTAL REVIEWS\n\n';
                out += data.reviews.map(renderReview).join('\n\n');

                respondFn(out);
            }, function (error) {
                respondFn('There was an error: ' + error);
            });

            // var params = {
            //     count: 6
            // },
            // count = msg.match[1],
            // langName = msg.match[3],
            // date = msg.match[5];

            // if (date) {
            //     var span = timespan(date);
            //     params.start = span.start().format(dateFormat);
            //     params.end = span.end().format(dateFormat);
            // }
            // if (count) {
            //     params.count = count;
            // }
            // if (langName) {
            //     params.lang = lang.toCode(langName);
            // }
        }
    };
};