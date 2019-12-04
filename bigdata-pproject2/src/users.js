var fs = require('fs');

function getWallet(user) {
    var file = './users/' + user + '/wallet.json';
    if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file));
    }
    return null;
}

function getAllThatHaveCurrency(type) {
    var users = fs.readdirSync('./users');
    var result = [];
    for(let i = 0; i< users.length; i++) {
        wallet = getWallet(users[i]);
        for(let j = 0; j < wallet.length; j++) {
            if(wallet[j].type === type) {
                result.push({'user': users[i], 'wallet' : wallet});
            }
        }
    }

    return result;
}

function writeUser(user, wallet) {
    fs.writeFileSync('./users/' + user + '/wallet.json', JSON.stringify(wallet));
}

module.exports = {
    getWallet: getWallet,
    getUsersWithCurrency: getAllThatHaveCurrency,
    writeUser: writeUser
}
