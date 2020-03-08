const crypto = require('crypto')

module.exports = function hash(text) {
    // https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options
    return crypto.createHash('sha256')
        .update(text, 'utf8')
        .digest('hex')
}
