const createConnection = require('../createConnection.js')

const connection = createConnection()

connection.query({
    sql: 'select * from notes'
},
    (error, results) => {
        console.log(results);
    }
)

connection.end();
