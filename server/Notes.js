const fs = require('fs');

function Notes() {
    // @todo: 如果notes规模太大，会有性能问题。后续改为 Redis 数据库。
    const jsonPath = './notes.json'

    // @todo: 如果读取失败，或者为空，则初始化为 []
    let rawData = fs.readFileSync(jsonPath);
    let notes = JSON.parse(rawData)

    // done: 不能只在启动服务器的时候排序，得在每次用户请求的排序
    sortNotesByTime()

    this.addNote = function (note) {
        sortNotesByTime()
        notes.push(note)
        writeJsonToDisk(notes)
        return notes
    }

    this.getOnePageNotes = function (lastDateOfRemainingItem) {
        sortNotesByTime()
        let start = calcNextPageIndex(lastDateOfRemainingItem)
        let end = start + 10

        let isLastPage = false
        if (end >= notes.length) {
            isLastPage = true
        } else {
            isLastPage = false
        }

        // 返回成员的序号从start到end-1
        return {
            notes: notes.slice(start, end),
            isLastPage
        }
    }

    this.getAllNotes = function () {
        sortNotesByTime()
        return notes
    }

    this.deleteNote = function (date) {
        // √ 1。找到对应note在notes列表中的序号，删除对应的数据
        let index
        notes.forEach((ele, idx) => {
            if (ele.date == date) {
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

    function calcNextPageIndex(lastDateOfRemainingItem) {
        let start
        if (lastDateOfRemainingItem == 0) {
            // 加载第一页
            start = 0
        } else {
            notes.forEach((element, index) => {
                if (element.date == lastDateOfRemainingItem) {
                    start = (index + 1)
                    return
                }
            })
        }
        return start
    }
}

module.exports = Notes;