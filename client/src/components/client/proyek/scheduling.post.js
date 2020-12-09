import axios from 'axios'

export default async (reqBody, reqbooty) => {

    const body = JSON.stringify(reqBody)
    const booty = JSON.stringify(reqbooty)

    const a = `{"idRabProyek":` + booty
    const b = `"sch":` + body + "}"

    const gabung = a + `,` + b
    console.log(gabung)
    
    try {
        let res = await axios({
            method: 'post',
            url: 'http://localhost:5000/scheduling/tambah',
            data: gabung,
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