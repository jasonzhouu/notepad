var mysql = require('mysql');
const fs = require('fs')
const path = require('path')



const databaseConfigPath = path.resolve(__dirname, '../../config/database.json')
let rawData = fs.readFileSync(databaseConfigPath);
let databaseInfo = JSON.parse(rawData)

// databaseInfo 的大概内容
// databaseInfo = {
//     host: 'localhost',
//     user: '******',
//     password: '******',
//     database: '******'
// }

module.exports = function () {
    var connection = mysql.createConnection(databaseInfo);
    connection.connect();
    return connection;
}
