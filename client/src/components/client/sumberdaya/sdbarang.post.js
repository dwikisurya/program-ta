import axios from 'axios'

export default async () => {
    try {
        let res = await axios.post('http://localhost:5000/sdbarang/tambah')

        console.log(`Status code: ${res.status}`);
        console.log(`Status text: ${res.statusText}`);
        console.log(`Request method: ${res.request.method}`);
        console.log(`Path: ${res.request.path}`);

    } catch (error) {
        console.log(error)
    }
}