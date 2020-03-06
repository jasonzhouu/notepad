let notes = new Notes()
document.querySelector('#publishNote button').addEventListener('click', event => {
    let content = document.querySelector('#noteEditor').value
    let date = Date.now()
    // @todo: 发布note后，将新发布的note显示出来
    // @todo: 按发布时间降序排列，新发布(即最后发布)的显示在最上面
    notes.publishtNote({
        date,
        content
    })
})

function Notes() {
    this.notes = [];
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
        })
    }

    function init() {
        getNotes(getNotesUrl)
            .then(data => {
                // 因为箭头函数的this绑定到了init()函数作用域的this
                // 而由于init函数的调用方式，决定了作用域的this绑定到了globalThis
                // 所以这里的this绑定到了globalThis
                // 解决办法1：将init()的this进行显式绑定
                // 解决办法2：将init()改为箭头函数
                this.notes = data;
                let ul = renderNotes(this.notes);
                notesList.replaceChild(ul, notesList.querySelector('ul'));
            });
    }
    function getNotes(url) {
        return fetch(url, {
            method: 'GET'
        }).then(reponse => reponse.json())
    }
    function renderNotes(notes) {
        let ul = document.createElement('ul')
        for (const note of notes) {
            let li = document.createElement('li')
            li.innerHTML = renderMarkdown(note.content)
            ul.appendChild(li)
        }
        return ul
    }
    function renderMarkdown(text) {
        return marked(text)
    }
}
