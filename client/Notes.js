import audoTextareaRows from './audoTextareaRows.js'
import loadNextPageInBottom from './loadNextPage.js'
import { getNotesAPI, postNoteAPI, deleteNoteAPI } from './fetchAPI.js'
import parseDate from './parseDate.js'
import showDialog from './utils/showDialog.js'

export default function Notes() {
    let notes = [];
    let notesList = document.querySelector('#notesList ul')
    let self = this
    this.isLoading = false
    this.isLastPage = false

    this.publishNote = function (note) {
        postNoteAPI({note})
            .then(data => {
                console.log(data.message)
                document.querySelector('#noteEditor').value = ""
                notes.unshift(note)
                showNewlyPublishedNote(note)
                localStorage.setItem('textarea', '')
                document.querySelector('#markdownPreview').innerHTML = ''
                audoTextareaRows()
            }).catch(error => {
                // @done: 由打印消息，改成弹窗提示
                showDialog('发布失败 <br>'+error.toString())
            })
    }

    this.loadPage = () => {
        let lastDateOfRemainingItem
        if (notes[notes.length - 1] == undefined) {
            // 启动页面后的第一次加载
            lastDateOfRemainingItem = 0
        } else {
            lastDateOfRemainingItem = notes[notes.length - 1].date
        }

        getNotesAPI({lastDateOfRemainingItem})
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
        deleteButton.addEventListener('click', () => {
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
        deleteNoteAPI({date})
            // 3。后端返回成功删除数据的消息后：
            .then(data => {
                console.log(data.message)
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
            }).catch(error => {
                // @done: 由打印消息，改成弹窗提示
                showDialog('删除失败 <br>'+error.toString())
            })
    }
    function renderMarkdown(text) {
        return md.render(text);
    }
}
