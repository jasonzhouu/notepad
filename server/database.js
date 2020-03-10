const mysql = require('mysql');
const {saltHashPassword, sha512} = require('./utils/saltHashPassword')

function Database() {
    const connection = mysql.createConnection({
        // @todo: 放在配置文件中
        host: 'localhost',
        user: 'debian-sys-maint',
        password: '43h16gjyppTMsfIR',
        database: 'test'
    });
    connection.connect();


    /**
     * ====================================================================================
     * ====================================================================================
     *                                      user 
     * ====================================================================================
     * ====================================================================================
     */

    /**
     * 搜索用户
     * @interface
     * @param {object} userinfo
     */
    this.searchUser = ({username, email}) => {
        if(username) {
            connection.query('SELECT * FROM users where username = ? limit 1', username, (error, result) => {
                if (error) throw error;
                return result;
            })
        } else if (email) {
            connection.query('select * from users where email = ?', email, (error, result) => {
                if(error) throw error;
                return result;
            })
        } else {
            throw Error('no result')
        }
    }

    /**
     * 创建用户
     * @interface
     * @param {object} userinfo
     */
    this.createUser = ({username, email, password}) => {
        let {salt, passwordHash} = saltHashPassword(password)
        connection.query({
                sql: 'insert into users( username, email, salt, hash ) values(?, ?, ?, ?)',
                values: [
                    username,
                    email,
                    salt,
                    passwordHash
                ]
            },
            (error, results) => {
                console.log(results);
            }
        )
    }

    /**
     * 验证用户
     */
    this.authenticateUser = ({username, email, password}) => {
        let user = this.searchUser({username, email})
        if(sha512(password, user.salt) == user.hash) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * ====================================================================================
     * ====================================================================================
     *                                      notes 
     * ====================================================================================
     * ====================================================================================
     */

    /**
     * 创建笔记
     * @interface
     * @param {object} note
     */
    this.addNote = ({content, user_id}) => {
        connection.query({
            sql: 'insert into test.notes(content, user_id) value(?, ?)',
            values: [content, user_id]
        },
        (error, results) => {
            if(error) throw error;
            return true;
        }
        )
    }

    /**
     * 获取一页notes（10条）
     * @interface
     * @param {object}
     */
    this.getNotes = ({lastDateOfRemainingItemOnClient, user_id}) => {
        // @todo: 设置选择条件，where date > lastDateOfRemainingItemOnClient and user_id = user_id, limit 10
        let isLastPage = false
        connection.query({
            sql: 'select * from test.notes where date > ? limit 10 and user_id = ?',
            values: [lastDateOfRemainingItemOnClient, user_id]
        }, (error, results) => {
            if(error) throw error

            if(results.length < 10) isLastPage = true
            else isLastPage = false

            return {
                notes: results,
                isLastPage
            }
        })
    }

    /**
     * 删除note
     * @interface
     * @param {number} id
     */
    this.deleteNote = (note_id) => {
        connection.query({
            sql: 'delete from notes where note_id = ?',
            values: [note_id]
        }, (error, result) => {
            if(error) throw error
            return true
        })
    }


    /**
     * ====================================================================================
     * ====================================================================================
     * ====================================================================================
     */
    this.disconnect = () => {
        connection.end();
    }
}

module.exports = Database;