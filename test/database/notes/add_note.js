const createConnection = require('../createConnection.js')

const connection = createConnection()

connection.query({
    sql: 'insert into notes(content, user_id) value(?, ?)',
    values: [
        '!',
        2
    ]
},
    (error, results) => {
        console.log(results);
    }
)

connection.end();
