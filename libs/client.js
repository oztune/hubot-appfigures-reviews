var _ = require('lodash'),
    afApi = require('./appfigures-api'),
    interpret = require('./interpret');

module.exports = function (credentials) {
    var defaults = {
        count: 6
    };

    var af = afApi(credentials);

    return {
        reviews: function (params) {
            params = toAPIOptions(params);

            console.log('API REQUEST:', params);

            return af.request('/reviews', {
                params: params
            });
        }
    };
};

function toAPIOptions(options) {

    function isDefined(value) {
        return value !== undefined;
    }
    function ifDefined(value, fn) {
        if (value) value = fn(value);
        return value;
    }

    var out = {
        q: interpret.string(options.query),
        products: ifDefined(interpret.array(options.products), function (arr) {
            return arr.map(interpret.product).filter(isDefined);
        }),
        countries: ifDefined(interpret.array(options.countries), function (arr) {
            return arr.map(interpret.country).filter(isDefined);
        }),
        count: interpret.number(options.count),
        lang: interpret.language(options.translate),
        author: interpret.string(options.author),
        version: ifDefined(interpret.array(options.versions), function (arr) {
            return arr.map(interpret.string).filter(isDefined);
        }),
        stars: ifDefined(interpret.array(options.ratings), function (arr) {
            return arr.map(interpret.number).filter(isDefined).map(function(num) {
                return Math.round(num);
            }).filter(function (rating) {
                return rating >= 0 && rating <= 5;
            });
        }),
        sort: interpret.string(options.sort),
        start: undefined,
        end: undefined
    };

    _.forEach(out, function(value, key) {
        if (value === undefined) {
            delete out[key];
        }
    });

    return out;
}