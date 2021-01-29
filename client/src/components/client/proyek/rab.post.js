import axios from 'axios'

export default async (reqBody, reqbooty, reqbounty, reqBONTY, inputsdm, inputsdb, inputworkhour, inputpcs) => {

    const a = JSON.stringify(reqBody)
    const d = JSON.stringify(reqbooty)
    const bounty = JSON.stringify(reqbounty)
    const i = JSON.stringify(reqBONTY)


    const b = `"rab":` + a + "}"
    const c = `{"idProyek":` + d
    const e = `"grandTotal":` + bounty
    const f = `"posted_by":` + i

    const inputsdmQ = `"idSDM":` + JSON.stringify(inputsdm)
    const inputsdbQ = `"idSDB":` + JSON.stringify(inputsdb)
    const inputworkhourQ = `"workhourSDM":` + JSON.stringify(inputworkhour)
    const inputpcsQ = `"pcsSDB":` + JSON.stringify(inputpcs)

    const gabung = c + `,` + e + `,` + f + `,` + inputsdmQ + `,` + inputsdbQ + `,` + inputworkhourQ + `,` + inputpcsQ + `,` + b

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