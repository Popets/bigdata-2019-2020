var cryptoReference = require('crypto');

var CryptoService = {};

var buildHash = function(algorith, str) {

    var hashInstance = cryptoReference.createHash(algorith);
    hashInstance.update(str);
    return hashInstance.digest('hex');
};

CryptoService.sha256 = function(str) {
    return buildHash("sha256", str);
};


var GeneratorService = {};

GeneratorService.blockId = function(currency) {

    var getTimestamp = (new Date()).getTime() + currency + '';
    return CryptoService.sha256(getTimestamp);
};

module.exports = {
    encryptWith      : CryptoService,
    decryptWhih      : CryptoService,
    generate         : GeneratorService
}
