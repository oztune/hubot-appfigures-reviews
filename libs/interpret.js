var _ = require('lodash'),
    lang = require('./lang');

// function interpret(input, converters) {
//     var i, len, converter;

//     if (!_.isArray(converters)) {
//         converters = _.toArray(arguments).slice(1);
//     }

//     len = converters.length;
//     for (i = 0; i < len; ++i) {
//         converter = getConverter(converters[i]);
//         if (!converter) {
//             console.log('Can\'t evaluate converter: ', converter);
//             continue;
//         }

//         input = converter(input);
//         if (input === undefined) return;
//     }

//     return input;
// }

// function getConverter(value) {
//     if (_.isFunction(value)) return value;
//     if (_.isString(value)) return interpret.converters[value];
//     return null;
// }

// interpret.array = function(value, converters) {
//     var arr, out;

//     if (!_.isArray(converters)) {
//         converters = _.toArray(arguments).slice(1);
//     }

//     arr = interpret(value, 'array');
//     if (!arr) return;

//     out = [];
//     arr.forEach(function (value) {
//         value = interpret(value, converters);
//         if (value === undefined) return;
//         out.push(value);
//     });

//     return out;
// };

// module.exports = interpreter;

/*
undefined means couldn't parse
null is a valid return value
*/

// interpret.converters = {
module.exports = {
    string: function (value) {
        if (value == null) return;
        return value + '';
    },
    array: function (value) {
        var arr;

        if (value == null) return;

        if (_.isString(value)) {
            arr = value.split(',');
        } else if (_.isArray(value)) {
            arr = value;
        } else {
            arr = [value];
        }

        return arr;
    },
    language: function (value) {
        return lang.toCode(value) || undefined;
    },
    country: function (value) {
        if (value == 'jp') return 'jp';
        return;
    },
    product: function (value) {
        return 123;
    },
    number: function (value) {
        value = parseFloat(value);
        if (isNaN(value)) return undefined;
        return value;
    }
};

// module.exports = interpret;