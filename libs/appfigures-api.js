/*
A simple appFigures API client.

Authenticates using Basic Auth, which only allows
access to accounts with registered API keys.
- This works well for cases where an appFigures member
  is the one hosting the client.
- Doesn't work well in cases where the appFigures member
   isn't hosting the client, since the client is required
   keep the user's credentials. For those cases the OAuth
   authentication method should we used.
*/
var afModule = function (username, password, clientKey) {
    var q = require('q'),
        request = require('request'),
        hostname = 'https://api.appfigures.com',
        baseUrl = '/v2';

    function extend(obj) {
        Array.prototype.slice.call(arguments, 1)
        .forEach(function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    }

    return {
        request: function (route, options) {
            var deferred = q.defer();

            options = extend({
                method: 'GET',
                params: null
            }, options);

            request({
                url: hostname + baseUrl + route,
                qs: extend({}, options.params, {
                    client_key: clientKey
                }),
                method: 'GET',
                auth: {
                    username: username,
                    password: password
                }
            }, function (error, response, body) {
                if (error) {
                    deferred.reject(error);
                } else if (response.statusCode !== 200) {
                    deferred.reject(body);
                } else {
                    deferred.resolve(JSON.parse(body));
                }
            });

            return deferred.promise;
        }
    };
};

module.exports = afModule;