var loginStatus = localStorage.getItem('login')
if (loginStatus == 'true') {
    show()
} else {
    hide()
}


function login(username, password) {
    hash(password).then(passwordHash => {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                passwordHash
            })
        }).then(reponse => reponse.json())
            .then(data => {
                let { status, randomNumber } = data
                console.log(status)
                if (status == 'login sucessfully') {
                    localStorage.setItem('login', 'true')
                    saveRandomNumberToCookie(randomNumber)
                    show()
                }
            })
    })
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

async function hash(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

function saveRandomNumberToCookie(randomNumber) {
    document.cookie = `randomNumber=${randomNumber}`;
}