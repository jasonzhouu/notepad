const fs = require('fs');

function Notes() {
    // @todo: 如果notes规模太大，会有性能问题。后续改为 Redis 数据库。
    const jsonPath = './test/notes.json'

    // @todo: 如果读取失败，或者为空，则初始化为 []
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