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
        })
        .then(response => {
            /**
             * 捕捉错误，参考：https://github.com/github/fetch/issues/201#issuecomment-308213104
             * 让后面直接进入catch部分执行；
             */

            // 如果正常，则返回数据，正常处理
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
    }
}

export const getNotesAPI = fetchAPI(URL.getNotes, FETCH_METHOD.post)
export const postNoteAPI = fetchAPI(URL.postNote, FETCH_METHOD.post)
export const deleteNoteAPI = fetchAPI(URL.deleteNote, FETCH_METHOD.delete)