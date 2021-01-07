import axios from 'axios'

export default async (reqBody, reqbooty, reqBounty) => {

    const body = JSON.stringify(reqBody)
    const booty = JSON.stringify(reqbooty)
    const bounty = JSON.stringify(reqBounty)

    const a = `{"idRabProyek":` + booty
    const b = `"sch":` + body + "}"
    const c = `"idMandor":` + bounty

    const gabung = a + `,` + c + `,` + b
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