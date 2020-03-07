import {whetherScrollBottom} from './scrollBottom.js'

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

let notes = new Notes()
document.querySelector('#publishNote button').addEventListener('click', event => {
    publishNote()
})

// 同时按下 ctrl, enter 键时，发布文章
document.addEventListener('keydown', event => {
    const keyName = event.key;

    if (keyName === 'Control') {
        // 如果只按ctl键，不做任何事
        return;
    }
    if (event.ctrlKey && keyName === 'Enter') {
        // 同时按下 ctrl, enter 键
        publishNote()
    }
})

// 输入文字时，将其保存到本地，以便刷新时从中读取
document.querySelector('#noteEditor').addEventListener('input', event => {
    localStorage.setItem('textarea', document.querySelector('#noteEditor').value)
})
document.querySelector('#noteEditor').value = localStorage.getItem('textarea')

function publishNote() {
    let content = document.querySelector('#noteEditor').value
    let date = Date.now()
    notes.publishtNote({
        date,
        content
    })
}

let isLoading = false
// 滑到到底部，加载下一页
window.onscroll = function () {
    // 解决滑到底部，检测到多次事件的问题
    if (whetherScrollBottom() && isLoading == false) {
        // 显示正在加载
        showLoadingIcon()
        // 等待1秒
        setTimeout(() => {
            notes.nextPage()
        }, 1000);
    }
};

function showLoadingIcon() {
    isLoading = true
    document.querySelector('#loading').innerHTML = 'loading...'
}

function deleteLoadingIcon() {
    isLoading = false
    document.querySelector('#loading').innerHTML = ''
}

expandTextArea()
function expandTextArea() {
    let dom = document.querySelector('textarea')
    while(dom.clientHeight < dom.scrollHeight) {
        dom.rows += 1
    }
}

document.querySelector('textarea').oninput = function() {
    this.rows = 3
    expandTextArea()
}

function Notes() {
    let notes = [];
    let getNotesUrl = "/notes"
    let postNoteUrl = "/addNotes"
    let notesList = document.querySelector('#notesList ul')
    let currentPage = 0;

    renderOnePageNotes()

    this.publishtNote = function (note) {
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
                notes.push(note)
                renderNewNote(note)
                localStorage.setItem('textarea', '')
            })
    }

    this.nextPage = renderOnePageNotes

    function renderOnePageNotes() {
        currentPage += 1
        getNotes(getNotesUrl, currentPage)
        .then(data => {
            notes.push(...data)
            renderNewRequestedNotes(data)
            // 去掉加载按钮
            deleteLoadingIcon()
        })
    }
    function getNotes(url, page) {
        return fetch(url+`/${page}`, {
            method: 'GET'
        }).then(reponse => reponse.json())
    }
    function renderNewRequestedNotes(data) {
        let newRenderedNotes = []
        for (const note of data) {
            newRenderedNotes.push(renderNote(note))
        }
        // 新加载的notes放在末尾
        notesList.append(...newRenderedNotes)
    }
    function renderNewNote(note) {
        let newNote = renderNote(note)
        newNote.style.cssText = 'max-height: 0px'
        notesList.prepend(newNote)
        setTimeout(() => {
            document.querySelector('#notesList ul').firstChild.style.cssText = 'max-height: 1000px'
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

        return li
    }
    function renderMarkdown(text) {
        return md.render(text);
    }
    function parseDate(date) {
        let dateObject = new Date(date)

        let year = dateObject.getFullYear()
        let month = dateObject.getMonth()
        let day = dateObject.getDate()

        let now = new Date()
        let nowYear = now.getFullYear()
        let nowMonth = now.getMonth()
        let nowDay = now.getDate()

        let dateFormat = ''
        if(year != nowYear) {
            // 不是今年发的，显示年月日
            dateFormat = `${year}/${month}/${day}`
        } else if(month != nowMonth  || day != nowDay) {
            // 不是今天发的，只显示月、日
            dateFormat = `${month}/${day}`
        } else if( year == nowYear && month == nowMonth && day == nowDay) {
            // 今天发的，只显示多久之前
            let interval = now - dateObject
            let second = (interval/1000).toFixed(0)
            let minute = (second%3600/60).toFixed(0)
            let hour = (second/3600).toFixed(0)
            second = second%3600%60
            if(hour >= 1) {
                dateFormat = `${hour}h ago`
            } else if(minute >= 1) {
                dateFormat = `${minute}m ago`
            } else {
                dateFormat = `${second}s ago`
            }
        }
        return dateFormat
    }
}
