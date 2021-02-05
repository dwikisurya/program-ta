import axios from 'axios'

export default async (reqBody, reqbooty, reqbounty, reqBONTY, inputsdm, inputsdb, workhour, pcssdb, inputjabatan) => {

    const a = JSON.stringify(reqBody)
    const d = JSON.stringify(reqbooty)
    const bounty = JSON.stringify(reqbounty)
    const i = JSON.stringify(reqBONTY)

    console.log(workhour)
    const iptsdb = JSON.stringify(inputsdb)
    const iptjabatan = JSON.stringify(inputjabatan)

    const b = `"rab":` + a + "}"
    const c = `{"idProyek":` + d
    const e = `"grandTotal":` + bounty
    const f = `"posted_by":` + i
    const g = `"idSDM":` + `["` + inputsdm + `"]`
    const h = `"idSDB":` + iptsdb
    const j = `"pcsSDB":` + `[` + pcssdb + `]`
    const k = `"workhourSDM":` + `[` + workhour + `]`
    const l = `"jabatan":` + iptjabatan

    const gabung = c + `,` + e + `,` + f + `,` + g + `,` + h + `,` + j + `,` + k + `,` + l + `,` + b

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