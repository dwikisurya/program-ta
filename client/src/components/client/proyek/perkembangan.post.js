import axios from 'axios'

export default async (reqBody) => {

    try {
        let res = await axios({
            method: 'post',
            url: 'http://localhost:5000/perkembangan/tambah',
            data: reqBody,
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        })

        console.log(`Status code: ${res.status}`);
        console.log(`Status text: ${res.statusText}`);

    } catch (error) {
        console.log(error)
    }
}