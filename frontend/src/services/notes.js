import axios from 'axios';

const baseURL = 'http://localhost:3001/api/notes';
//const baseURL = 'https://fast-hollows-86103.herokuapp.com/api/notes';

const getAll = () => {
    const request = axios.get(baseURL);
    return request.then( response => response.data );
}

const create = newObject => {
    const request = axios.post(baseURL, newObject);
    return request.then( response => response.data);
}

const update = (id, newObject) => {
    const request = axios.put(`${baseURL}/${id}`, newObject);
    return request.then( response => response.data);
}

const noteService = {
    getAll,
    create,
    update
}
export default noteService;