import Notes from './Notes.js'
import loadNextPage from './loadNextPage.js'
import audoTextareaRows from './audoTextareaRows.js'

let notes = new Notes()
notes.loadPage()
document.querySelector('#publishNote button').addEventListener('click', () => {
    publishNote()
})



loadNextPage(notes)




// 输入文字时，将其保存到本地，以便刷新时从中读取
document.querySelector('#noteEditor').addEventListener('input', event => {
    localStorage.setItem('textarea', document.querySelector('#noteEditor').value)
})
document.querySelector('#noteEditor').value = localStorage.getItem('textarea')




// 自动伸缩输入框的高度
audoTextareaRows()
document.querySelector('textarea').oninput = audoTextareaRows


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
    // 当内容为空时，不发布
    if (content.trim() == '') return;
    let date = Date.now()
    notes.publishtNote({
        date,
        content
    })
}


