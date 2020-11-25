import axios from 'axios'

export default async (reqBody) => {
    try {
        let res = await axios({
            method: 'post',
            url: 'http://localhost:5000/sdbarang/tambah',
            data: reqBody
        })

        console.log(`Status code: ${res.status}`);
        console.log(`Status text: ${res.statusText}`);
        console.log(`Request method: ${res.method}`);
        console.log(`Path: ${res.path}`);

    } catch (error) {
        console.log(error)
    }
}