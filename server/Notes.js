const fs = require('fs');

function Notes() {
    // @todo: 如果notes规模太大，会有性能问题。后续改为 Redis 数据库。
    const jsonPath = './test/notes.json'

    // @todo: 如果读取失败，或者为空，则初始化为 []
    let rawData = fs.readFileSync(jsonPath);
    let notes = JSON.parse(rawData)

    // done: 不能只在启动服务器的时候排序，得在每次用户请求的排序
    sortNotesByTime()

    this.addNote = function(note) {
        sortNotesByTime()
        notes.push(note)
        fs.writeFileSync(jsonPath, JSON.stringify(notes, null, '\t'));
        return notes
    }

    this.getOnePageNotes = function(page) {
        sortNotesByTime()
        let start = 10 * (page -1)
        let end = 10 * page - 1
        return notes.slice(start, end)
    }

    this.getAllNotes = function() {
        sortNotesByTime()
        return notes
    }

    function sortNotesByTime() {
        notes = notes.sort((i, j) => (j.date - i.date))
    }
}

module.exports = Notes;