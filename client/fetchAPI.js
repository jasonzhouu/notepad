const getNotesUrl = "/notes"
const deleteNoteUrl = "/note"
const postNoteUrl = "/addNote"

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

export const getNotesAPI = fetchAPI(getNotesUrl, fetchMethod.post);
export const postNoteAPI = fetchAPI(postNoteUrl, fetchMethod.post)
export const deleteNoteAPI = fetchAPI(deleteNoteUrl, fetchMethod.delete)