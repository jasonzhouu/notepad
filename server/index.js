const express = require('express')
const Notes = require('./Notes')

const app = express()
const notes = new Notes()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.static('client'));
app.get('/notes', (req, res) => {
    res.send(notes.getNotes())
})

app.post('/addNotes', (req, res) => {
    notes.addNote({
        ...req.body
    })
    res.send({
        status: 'sucess'
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

// @done: 在主页展示notes
// @done: 发布 note
// @done: 将 markdown 格式的notes渲染成html