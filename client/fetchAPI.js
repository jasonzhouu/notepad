const Url = {
    getNotes: '/notes',
    deleteNote: '/note',
    postNote: '/addNote'
}

const fetchMethod = {
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

export const getNotesAPI = fetchAPI(Url.getNotes, fetchMethod.post);
export const postNoteAPI = fetchAPI(Url.postNote, fetchMethod.post)
export const deleteNoteAPI = fetchAPI(Url.deleteNote, fetchMethod.delete)