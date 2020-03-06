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
    let content = document.querySelector('#noteEditor').value
    let date = Date.now()
    // @done: 发布note后，将新发布的note显示出来：更新notes，并渲染
    // @done: 发布note后，将输入框清空
    // @done: markdown渲染引擎改用 markdown-it，效果更好
    // @done: 显示发布时间
    // @done: 将毫秒格式的时间转换成local time
    // @done: 按发布时间降序排列，新发布(即最后发布)的显示在最上面
    // @todo: 美化列表，去掉前缀点号
    // @todo: 美化输入框
    notes.publishtNote({
        date,
        content
    })
})

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
        date = new Date(date)
        return date.toLocaleDateString()
    }
    function sortNotesByTime() {
        notes = notes.sort((i, j) => {
            return (j.date - i.date)
        })
    }
}
