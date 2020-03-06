// @done: 发布note后，将新发布的note显示出来：更新notes，并渲染
// @done: 发布note后，将输入框清空
// @done: markdown渲染引擎改用 markdown-it，效果更好
// @done: 显示发布时间
// @done: 将毫秒格式的时间转换成local time
// @done: 按发布时间降序排列，新发布(即最后发布)的显示在最上面
// @done: 按ctrl enter键发布
// @done: 美化notes列表，去掉前缀点号
// @done: 美化输入框

// @todo: 发布图片
// @todo: 发布事件显示精确到分钟
// @todo: 分页

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

function publishNote() {
    let content = document.querySelector('#noteEditor').value
    let date = Date.now()
    notes.publishtNote({
        date,
        content
    })
}

function Notes() {
    let notes = [];
    let getNotesUrl = "/notes"
    let postNoteUrl = "/addNotes"
    let notesList = document.querySelector('#notesList')

    init.apply(this)

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
                showNotes()
            })
    }

    function init() {
        getNotes(getNotesUrl)
            .then(data => {
                notes = data;
                showNotes()
            });
    }
    function getNotes(url) {
        return fetch(url, {
            method: 'GET'
        }).then(reponse => reponse.json())
    }
    function showNotes() {
        // 开始渲染前，先对notes按发布时间排序
        sortNotesByTime()

        let ul = renderNotes();
        notesList.replaceChild(ul, notesList.querySelector('ul'));
    }
    function renderNotes() {
        let ul = document.createElement('ul')
        for (const note of notes) {
            let li = document.createElement('li')

            let noteDOM = document.createElement('p')
            noteDOM.innerHTML = renderMarkdown(note.content)
            li.appendChild(noteDOM)

            let dateDOM = document.createElement('span')
            dateDOM.textContent = parseDate(note.date)
            li.appendChild(dateDOM)

            ul.appendChild(li)
        }
        return ul
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
    function sortNotesByTime() {
        notes = notes.sort((i, j) => {
            return (j.date - i.date)
        })
    }
}
