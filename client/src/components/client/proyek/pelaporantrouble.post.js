import axios from 'axios'

export default async (id, namaproyek, statusq, postedby) => {
    const idq = JSON.stringify(id)
    const namaproyekq = JSON.stringify(namaproyek)
    const statusqq = JSON.stringify(statusq)
    const postedbyq = JSON.stringify(postedby)

    const a = `{"idPelaporan":` + idq
    const e = `"uraian":` + statusqq
    const f = `"posted_by":` + postedbyq
    const b = `"namaProyek":` + namaproyekq + "}"

    const gabung = a + ',' + e + ',' + f + ',' + b

    try {
        let res = await axios({
            method: 'post',
            url: 'http://localhost:5000/pelaporantrouble/tambah',
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