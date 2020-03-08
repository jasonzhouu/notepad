const express = require('express')
const fs = require('fs')
const Notes = require('./Notes')
const hash = require('./hash')

const app = express()
const notes = new Notes()
const port = 3000



app.use(express.json()) // for parsing application/json


// 静态文件
app.use(express.static('client'));


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
    let date = req.body.date
    // √ 2。交给notes对象，删除内存中的note；删除json中的note；
    notes.deleteNote(date)
    res.send({
        status: 'delete successfully'
    })
})


// 路由3：新建note
app.post('/addNote', (req, res) => {
    notes.addNote({
        ...req.body.note
    })
    res.send({
        status: 'add notes successfully'
    })
})

// 路由4：登录
app.post('/login', (req, res) => {
    const jsonPath = './auth.json'
    let rawData = fs.readFileSync(jsonPath);
    let authInfo = JSON.parse(rawData)

    let clientInfo = req.body

    if (authInfo.username == clientInfo.username && hash(authInfo.password) == clientInfo.passwordHash) {
        res.send({
            status: 'login sucessfully'
        })
    } else {
        res.send({
            status: 'login failed'
        })
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

