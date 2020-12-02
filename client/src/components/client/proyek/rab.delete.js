import axios from 'axios'

export default async (id) => {
    try {
        const URL = `http://localhost:5000/rab/${id}`
        return await axios.delete(URL, {
            data: id
        })
    } catch (error) {
        return error
    }
}