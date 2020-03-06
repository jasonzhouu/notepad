const fs = require('fs');

function Notes() {
    // @todo: 如果notes规模太大，会有性能问题。后续改为 Redis 数据库。
    const jsonPath = './test/notes.json'
    let rawData = fs.readFileSync(jsonPath);
    let notes = JSON.parse(rawData)

    this.addNote = function(note) {
        notes.push(note)
        fs.writeFileSync(jsonPath, JSON.stringify(notes, null, '\t'));
        return notes
    }

    this.getNotes = function() {
        return notes
    }
}

module.exports = Notes;