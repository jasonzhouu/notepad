import Notes from './Notes.js'
import loadNextPageInBottom from './loadNextPage.js'
import audoTextareaRows from './audoTextareaRows.js'
import addPublishNoteEvent from './addPublishNoteEvent.js'

let notes = new Notes()
notes.loadPage()



// 注册滑到底部时，加载下一页的事件
loadNextPageInBottom(notes)



// 注册发布note的事件
addPublishNoteEvent(notes)



// 输入文字时，将其保存到本地，以便刷新时从中读取
document.querySelector('#noteEditor').addEventListener('input', event => {
    localStorage.setItem('textarea', document.querySelector('#noteEditor').value)
})
document.querySelector('#noteEditor').value = localStorage.getItem('textarea')




// 自动伸缩输入框的高度的3个时刻：刚加载页面、输入内容、发布内容
audoTextareaRows()
document.querySelector('textarea').oninput = audoTextareaRows


