// 监测textarea输入事件，如果内容不为空，将按markdown格式渲染
let markdownPreview = document.querySelector('#markdownPreview')

export default function audoTextareaRows(notes) {
    let textarea = document.querySelector('textarea')
    textarea.rows = 3
    while (textarea.clientHeight < textarea.scrollHeight) {
        textarea.rows += 1
    }

    
    // 当内容为空时，将按钮调暗
    let submit = document.querySelector('#publishNote > button')
    if (textarea.value.trim() != '') {
        submit.classList.add('active')
    } else {
        submit.classList.remove('active')
    }

    // 预览markdown
    markdownPreview.innerHTML = notes.renderMarkdown(textarea.value)

}