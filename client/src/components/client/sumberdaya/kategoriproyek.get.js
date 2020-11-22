import axios from 'axios'

export default async () => {
    try {
        const URL = 'http://localhost:5000/kategoriproyek/'
        return await axios.get(URL, {
            timeout: 3000,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        return error
    }
}