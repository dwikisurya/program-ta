import axios from 'axios'

export default async (reqBody, reqbooty, reqbounty, reqBONTY) => {

    const a = JSON.stringify(reqBody)
    const d = JSON.stringify(reqbooty)
    const bounty = JSON.stringify(reqbounty)
    const i = JSON.stringify(reqBONTY)

    const b = `"rab":` + a + "}"
    const c = `{"idProyek":` + d
    const e = `"grandTotal":` + bounty
    const f = `"posted_by":` + i
    const gabung = c + `,` + e + `,` + f + `,` + b

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

    } catch (error) {
        console.log(error)
    }
}