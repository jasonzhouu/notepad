
export default function addPublishNoteEvent(notes) {
    document.querySelector('#publishNote button').addEventListener('click', () => {
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
        // 当内容为空时，不发布
        if (content.trim() == '') return;
        let date = Date.now()
        notes.publishNote({
            date,
            content
        })
    }
}    
