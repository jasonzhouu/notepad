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
        writeJsonToDisk(notes)
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

    this.deleteNote = function(date) {
        // √ 1。找到对应note在notes列表中的序号，删除对应的数据
        let index
        notes.forEach((ele, idx) => {
            if(ele.date == date) {
                index = idx
            }
        });
        notes.splice(index, 1)
        // √ 2。写入json
        writeJsonToDisk(notes)
    }

    function sortNotesByTime() {
        notes = notes.sort((i, j) => (j.date - i.date))
    }

    function writeJsonToDisk(notes) {
        fs.writeFileSync(jsonPath, JSON.stringify(notes, null, '\t'));
    }
}

module.exports = Notes;