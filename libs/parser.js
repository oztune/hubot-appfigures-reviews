var _ = require('lodash'),
    regexp = /^fetch (.*?)reviews?\s?(.*)/i,
    tokensRegexp = /(\S+)/g;

var parser = {
    tokenParsers: [],
    plugins: {},
    regexp: function () {
        return regexp;
    },
    parse: function (match, options) {
        var left, right;

        if (typeof match === 'string') {
            match = match.match(regexp);
            if (match) {
                return this.parse(match, options);
            } else {
                return null;
            }
        } else if (!(match instanceof Array)) {
            throw 'Unknown input to parse ' + match + '. Should be string or array of matches.';
        }

        options = options || {};

        left = parseTokens(match[1], options.unmatchedTokens);
        right = parseArgs(match[2]);

        if (!left && !right) return null;

        return _.extend({}, left, right);
    }
};

// Utils
function isNumeric(value) {
    return !isNaN(parseFloat(value));
}

/*
Parses plugins
*/
function parseTokens(string, unmatched) {
    var tokens, output;

    if (typeof string !== 'string') return null;

    tokens = string.match(tokensRegexp);

    if (!tokens || tokens.length <= 0) return null;

    tokens.forEach(function (token, i) {
        var params = parseToken(token);

        if (params) {
            output = _.extend(output || {}, params);
        } else {
            if (unmatched) unmatched.push(token);
        }
    });

    return output;
}

function parseToken(token) {
    var arr = parser.tokenParsers,
        len = arr.length,
        tokenParser,
        val;

    for (var i = 0; i < len; ++i) {
        tokenParser = arr[i];
        val = tokenParser(token);
        if (val != null) break;
    }

    return val;
}

/*
Parses parameters
*/
function parseArgs(string) {

    // Get the first word
    var match = string.match(/(\S+)\s+(.*)/i);

    if (!match) return;

    var firstWord = match[1];

    if (firstWord === 'in') {
        return {
            translate: match[2]
        };
    }
}

//
// Default token parsers
//

// Numbers are the count
parser.tokenParsers.push(function (token) {
    if (isNumeric(token)) {
        return {
            count: Number(token)
        };
    }
});

// Look up in parser.plugins
parser.tokenParsers.push(function (token) {
    return parser.plugins[token];
});

require('./plugins')(parser);

module.exports = parser;