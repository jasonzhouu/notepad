
var notes = new Notes()

function Notes() {
    this.notes = [];
    let getNotesUrl = "/notes"
    let postNoteUrl = "/addNotes"
    let notesList = document.querySelector('#notesList')

    init();

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
