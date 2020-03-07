var loginStatus = localStorage.getItem('login')
if (loginStatus == 'true') {
    show()
} else {
    hide()
}


function login() {
    localStorage.setItem('login', 'true')
    show()
}
function logout() {
    localStorage.setItem('login', 'false')
    hide()
}

function show() {
    document.getElementById('publishNote').style.display = 'block'
    document.querySelectorAll('#notesList > ul > li > button').forEach(element => {
        element.style.display = 'inline'
    })
}

function hide() {
    document.getElementById('publishNote').style.display = 'none'
    document.querySelectorAll('#notesList > ul > li > button').forEach(element => {
        element.style.display = 'none'
    })
}