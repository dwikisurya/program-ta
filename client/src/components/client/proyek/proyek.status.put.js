import axios from 'axios'

export default async (idform, reqBody) => {
    console.log(reqBody)
    try {
        let res = await axios({
            method: 'PUT',
            url: `http://localhost:5000/proyek/status/${idform}`,
            data: reqBody
        })
        console.log(`Status code: ${res.status}`);
        console.log(`Status text: ${res.statusText}`);

    } catch (error) {
        return error, console.log(error)
    }
}