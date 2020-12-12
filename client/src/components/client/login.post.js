import axios from 'axios'

export default async (reqBody) => {
    console.log(reqBody)
    try {
        return await axios({
            method: 'POST',
            url: `http://localhost:5000/auth/login/`,
            data: reqBody
        })

    } catch (error) {
        return error
    }
}