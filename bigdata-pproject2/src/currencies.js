var fs = require('fs');

var currenceies = function () {
    return JSON.parse(fs.readFileSync('./currencies.json'));
}

module.exports = {
    get: currenceies()
}
