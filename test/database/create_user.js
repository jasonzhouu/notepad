const createConnection = require('./createConnection.js')

const connection = createConnection()

connection.query(
    {
        sql: 'insert into users( username, email, salt, hash ) values(?, ?, ?, ?)',
        values: [
            'jasonzhouu2344',
            'jasonzhouu@1632443.com',
            '219f8b36dd9d4e13',
            '4d7e5302ff36c761db3ca7992400e78d7547a549d2a4d8906aecbc441cbc693ac77938c23d89a748fbaff4db8758403583f3265769766d97061d7208f875e32f'
        ]
    },
    (error, results) => {
        console.log(results);
    }
)

connection.end();


