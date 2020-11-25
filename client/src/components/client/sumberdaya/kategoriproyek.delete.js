import axios from 'axios'

export default async (id) => {
    try {
        const URL = `http://localhost:5000/kategoriproyek/${id}`
        return await axios.delete(URL, {
            data: id
        })
    } catch (error) {
        return error
    }
}