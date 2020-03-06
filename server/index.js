const express = require('express')
const add_note = require('./add_note')
const notes = require('../test/notes.js')



const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.static('client'));
app.get('/notes', (req, res) => res.send(notes))

app.post('/add_note', (req, res) => {
    add_note({
        ...req.body
    })
    res.send('sucess')
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))