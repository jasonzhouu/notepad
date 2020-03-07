const URL = {
    getNotes: '/notes',
    deleteNote: '/note',
    postNote: '/addNote'
}

const FETCH_METHOD = {
    get: 'GET',
    post: 'POST',
    delete: 'DELETE'
}

const fetchAPI = (url, method) => {
    return (data) => {
        return fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(reponse => reponse.json())
    }
}

export const getNotesAPI = fetchAPI(URL.getNotes, FETCH_METHOD.post)
export const postNoteAPI = fetchAPI(URL.postNote, FETCH_METHOD.post)
export const deleteNoteAPI = fetchAPI(URL.deleteNote, FETCH_METHOD.delete)