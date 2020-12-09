import axios from 'axios'

export default async (reqBody, reqbooty, reqbounty) => {

    const a = JSON.stringify(reqBody)
    const d = JSON.stringify(reqbooty)
    const bounty = JSON.stringify(reqbounty)

    const b = `"rab":` + a + "}"
    const c = `{"idProyek":` + d
    const e = `"grandTotal":` + bounty
    const gabung = c + `,` + e + `,` + b

    console.log(gabung)
    try {
        let res = await axios({
            method: 'post',
            url: 'http://localhost:5000/rab/tambah',
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