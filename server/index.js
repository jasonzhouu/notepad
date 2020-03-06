const express = require('express')

const notes = require('../test/notes.js')

const app = express()
const port = 3000

app.use(express.static('client'));

app.get('/foo', (req, res) => res.send('bar'))


app.get('/notes', (req, res) => res.send(notes))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))