const express = require('express')
const Notes = require('./Notes')

const app = express()
const notes = new Notes()
const port = 3000



app.use(express.json()) // for parsing application/json
app.use(express.static('client'));

// 请求所有notes
app.get('/notes', (req, res) => {
    res.send(notes.getAllNotes())
})

// 分页请求
app.get('/notes/:page', (req, res) => {
    res.send(notes.getNotes(req.params.page))
})



app.post('/addNotes', (req, res) => {
    notes.addNote({
        ...req.body
    })
    res.send({
        status: 'success'
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

