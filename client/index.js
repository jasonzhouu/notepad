let notes = new Notes()
document.querySelector('#publishNote button').addEventListener('click', event => {
    let content = document.querySelector('#noteEditor').value
    let date = Date.now()
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

    init()

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
            li.textContent = note.content
            ul.appendChild(li)
        }
        return ul
    }
}
