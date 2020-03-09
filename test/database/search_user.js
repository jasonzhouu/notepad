const createConnection = require('./createConnection.js')

const connection = createConnection()


connection.query({
    sql: 'SELECT * FROM test.users where username = ? limit 1',
    values: ['jasonzhouu']
}, (error, results) => {
    console.log(results);
})

connection.end();
