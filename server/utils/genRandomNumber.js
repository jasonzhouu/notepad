// 参考： https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
var crypto = require('crypto');
const fs = require('fs')

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomNumber(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

function saveRandomNumber(randomNumber) {
    const jsonPath = './config/session.json'
    let rawData = fs.readFileSync(jsonPath);
    let session = JSON.parse(rawData)
    session.push(randomNumber)
    fs.writeFileSync(jsonPath, JSON.stringify(session, null, '\t'));
}

module.exports = {
    genRandomNumber,
    saveRandomNumber
}