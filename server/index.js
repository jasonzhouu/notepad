const express = require('express')
const Notes = require('./Notes')

const app = express()
const notes = new Notes()
const port = 3000



app.use(express.json()) // for parsing application/json
app.use(express.static('client'));


// 分页请求
app.post('/notes', (req, res) => {
    let lastDateOfRemainingItem = req.body.lastDateOfRemainingItem
    // 返回数据包含notes数组，isLastPage布尔值
    let response = notes.getOnePageNotes(lastDateOfRemainingItem)
    res.send(response)

})

// done: 删除note
// √ 1。建立路由, 将date作为唯一标志
app.delete('/note', (req, res) => {
    let date = req.body.date
    // √ 2。交给notes对象，删除内存中的note；删除json中的note；
    notes.deleteNote(date)
    res.send({
        status: 'delete success'
    })
})


// 新建note
app.post('/addNote', (req, res) => {
    notes.addNote({
        ...req.body.note
    })
    res.send({
        status: 'add notes success'
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

