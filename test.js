var bot = require('./libs/bot')({
    username: username,
    password: password,
    clientKey: clientKey
});

// Useful for testing
var input = process.argv[2];
bot.parse(input, function (string) {
    console.log(string);
});