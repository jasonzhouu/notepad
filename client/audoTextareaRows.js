export default function audoTextareaRows() {
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
}