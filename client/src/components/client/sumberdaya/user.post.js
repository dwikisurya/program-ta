import axios from 'axios'

export default async (reqBody) => {
    try {
        let res = await axios({
            method: 'post',
            url: 'http://localhost:5000/auth/register',
            data: reqBody
        })

        console.log(`Status code: ${res.status}`);
        console.log(`Status text: ${res.statusText}`);

    } catch (error) {
        console.log(error)
    }
}