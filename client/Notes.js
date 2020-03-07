import audoTextareaRows from './audoTextareaRows.js'
import loadNextPageInBottom from './loadNextPage.js'


var md = window.markdownit({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) { }
        }

        return ''; // use external default escaping
    }
});


export default function Notes() {
    let notes = [];
    let getNotesUrl = "/notes"
    let deleteNoteUrl = "/note"
    let postNoteUrl = "/addNote"
    let notesList = document.querySelector('#notesList ul')
    let self = this
    this.isLoading = false
    this.isLastPage = false

    this.publishNote = function (note) {
        fetch(postNoteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        }).then(response => response.json())
            .then(data => {
                console.log(`post note status: ${data.status}`)
                document.querySelector('#noteEditor').value = ""
                notes.unshift(note)
                showNewlyPublishedNote(note)
                localStorage.setItem('textarea', '')
                document.querySelector('#markdownPreview').innerHTML = ''
                audoTextareaRows(this)
            })
    }

    this.loadPage = () => {
        let lastDateOfRemainingItem
        if(notes[notes.length-1] == undefined) {
            // 启动页面后的第一次加载
            lastDateOfRemainingItem = 0
        } else {
            lastDateOfRemainingItem = notes[notes.length-1].date
        }

        fetch(getNotesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lastDateOfRemainingItem
            })
        }).then(reponse => reponse.json())
            .then(data => {
                let newNotes = data.notes
                notes.push(...newNotes)
                this.isLastPage = data.isLastPage
                // 加载到下一页的数据后，转成DOM，并附加到末尾
                renderNewRequestedNotes(newNotes)
                // 去掉加载按钮
                document.querySelector('#loading').innerHTML = ''
                this.isLoading = false
            })
    }
    function renderNewRequestedNotes(data) {
        let newRenderedNotes = []
        for (const note of data) {
            newRenderedNotes.push(renderNote(note))
        }
        notesList.append(...newRenderedNotes)
    }
    function showNewlyPublishedNote(note) {
        let newNote = renderNote(note)
        newNote.style.cssText = 'background-color: #F5F8FA;'
        notesList.prepend(newNote)
        setTimeout(() => {
            document.querySelector('#notesList ul').firstChild.style.cssText = 'background-color: none;'
        }, 500);
    }
    function renderNote(note) {
        let li = document.createElement('li')

        let noteDOM = document.createElement('p')
        noteDOM.innerHTML = renderMarkdown(note.content)
        li.appendChild(noteDOM)

        let dateDOM = document.createElement('span')
        dateDOM.textContent = parseDate(note.date)
        li.appendChild(dateDOM)

        let deleteButton = document.createElement('button')
        deleteButton.textContent = '×'
        deleteButton.addEventListener('click', event => {
            deleteNote(note.date)
        })
        li.appendChild(deleteButton)

        return li
    }
    function deleteNote(date) {
        // @done: 删除note，步骤：
        // √ 1。获取dom对应的数据：date
        //      方法1：先获取dom对应的序列号，然后从notes中获取对应序号的数据
        //    √ 方法2：给每个按钮的事件中加入数据
        // √ 2。发送到后端，在后端删除数据
        fetch(deleteNoteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        }).then(response => response.json())
            // 3。后端返回成功删除数据的消息后：
            .then(data => {
                console.log(data.status)
                // 3。1找到对应note在notes列表中的序号，删除对应的数据
                let index
                notes.forEach((ele, idx) => {
                    if (ele.date == date) {
                        index = idx
                    }
                });
                notes.splice(index, 1)
                // 3。2 将其dom移除
                notesList.removeChild(
                    notesList.childNodes[index]
                )

                loadNextPageInBottom(self)
            })
    }
    function renderMarkdown(text) {
        return md.render(text);
    }
    this.renderMarkdown = renderMarkdown
    function parseDate(date) {
        let dateObject = new Date(date)

        let year = dateObject.getFullYear()
        let month = dateObject.getMonth() + 1 // getMonth()返回的0表示一月
        let day = dateObject.getDate()

        let now = new Date()
        let nowYear = now.getFullYear()
        let nowMonth = now.getMonth() + 1
        let nowDay = now.getDate()

        let dateFormat = ''
        if (year != nowYear) {
            // 不是今年发的，显示年月日
            dateFormat = `${year}/${month}/${day}`
        } else if (month != nowMonth || day != nowDay) {
            // 不是今天发的，只显示月、日
            dateFormat = `${month}/${day}`
        } else if (year == nowYear && month == nowMonth && day == nowDay) {
            // 今天发的，只显示多久之前
            let interval = now - dateObject
            let second = (interval / 1000).toFixed(0)
            let minute = (second % 3600 / 60).toFixed(0)
            let hour = (second / 3600).toFixed(0)
            second = second % 3600 % 60
            if (hour >= 1) {
                dateFormat = `${hour}h ago`
            } else if (minute >= 1) {
                dateFormat = `${minute}m ago`
            } else {
                dateFormat = `${second}s ago`
            }
        }
        return dateFormat
    }
}
