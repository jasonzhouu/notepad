const getNotesUrl = "/notes"
const deleteNoteUrl = "/note"
const postNoteUrl = "/addNote"


export function getNotesAPI(lastDateOfRemainingItem) {
    return fetch(getNotesUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lastDateOfRemainingItem
        })
    }).then(reponse => reponse.json())
}

export function postNoteAPI(note) {
    return fetch(postNoteUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note })
    }).then(response => response.json())
}

export function deleteNoteAPI(date) {
    return fetch(deleteNoteUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date })
    }).then(response => response.json())
}