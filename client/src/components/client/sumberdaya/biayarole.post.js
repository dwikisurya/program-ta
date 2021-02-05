import axios from 'axios'

export default async (reqBody) => {
    console.log(reqBody)
    try {
        let res = await axios({
            method: 'post',
            url: 'http://localhost:5000/biayarole/tambah',
            data: reqBody
        })
    } catch (error) {
        console.log(error)
    }
}