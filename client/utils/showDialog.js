export default function showDialog(info) {
    let dialog = document.createElement('div')
    dialog.innerHTML = info
    document.getElementById('dialog').prepend(dialog)
    setTimeout(() => {
        dialog.style.cssText = 'display: none;'
    }, 2000);
}