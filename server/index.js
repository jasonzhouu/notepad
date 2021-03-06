const express = require('express')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const Notes = require('./Notes')
const hash = require('./utils/hash')
const { genRandomNumber, saveRandomNumber } = require('./utils/genRandomNumber')

const app = express()
const notes = new Notes()
const port = 3000

/**
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 *                                      中间件 
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 */

// 1. for parsing application/json
app.use(express.json())
// 2. 解析cookie
app.use(cookieParser())
// 3. 静态文件
app.use(express.static('client'));
// 4. 解析cookie
app.use(cookieParser())


/**
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 *                                      路由 
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 */

// 路由1：请求一些notes数据
app.post('/notes', (req, res) => {
    let lastDateOfRemainingItem = req.body.lastDateOfRemainingItem
    // 返回数据包含notes数组，isLastPage布尔值
    let response = notes.getOnePageNotes(lastDateOfRemainingItem)
    res.send(response)

})

// 路由2: 删除note
// √ 1。建立路由, 将date作为note的唯一标志
app.delete('/note', (req, res) => {
    authorizationHandler({req, res}, () => {
        let date = req.body.date
        // √ 2。交给notes对象，删除内存中的note；删除json中的note；
        notes.deleteNote(date)
        res.send({
            message: 'delete successfully'
        })
    })
})


// 路由3：新建note
app.post('/addNote', (req, res) => {
    authorizationHandler({req, res}, () => {
        notes.addNote({
            ...req.body.note
        })
        res.send({
            message: 'add notes successfully'
        })
    })
})


// 路由4：登录
app.post('/login', (req, res) => {
    const jsonPath = './config/auth.json'
    let rawData = fs.readFileSync(jsonPath);
    let authInfo = JSON.parse(rawData)

    let clientInfo = req.body

    if (authInfo.username == clientInfo.username && hash(authInfo.password) == clientInfo.passwordHash) {
        let randomNumber = genRandomNumber(32)
        saveRandomNumber(randomNumber)
        res.send({
            randomNumber,
            message: 'login sucessfully'
        })
    } else {
        res.send({
            message: 'login failed'
        })
    }
})


// 路由5：单个note数据
app.post('/note', (req, res) => {
    let date = parseInt(req.body.date)
    res.send({
        note: notes.getOneNote(date)
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})


function authorizationHandler({req, res}, handler) {
    if (isAuthorized(req.cookies)) {
        handler()
    } else {
        res.sendStatus(401)
    }
}

function isAuthorized(cookie) {
    const jsonPath = './config/session.json'
    let rawData = fs.readFileSync(jsonPath);
    let session = JSON.parse(rawData)
    return session.includes(cookie.randomNumber)
}