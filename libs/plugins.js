// Coverts string to api options

var _ = require('lodash');

module.exports = function (parser) {
    ['new', 'newest', 'latest', 'recent', 'last'].map(function (string) {
        parser.plugins[string] = {
            sort: 'date'
        };
    });

    ['old', 'oldest'].map(function (string) {
        parser.plugins[string] = {
            sort: '-date'
        };
    });

    parser.plugins['best'] = {
        sort: '-stars'
    };
    parser.plugins['worst'] = {
        sort: 'stars'
    };

    _.extend(parser.plugins, {
        'bad': {
            ratings: '1, 2'
        },
        'good': {
            ratings: [3, 4, 5]
        },
        'great': {
            ratings: [4, 5]
        }
    });
};