import axios from 'axios'

export default async (rab, proyek, id) => {
    const rabq = JSON.stringify(rab)
    const proyekq = JSON.stringify(proyek)

    const rabqq = `"rab":` + rabq + "}"
    const proyekqq = `{"idProyek":` + proyekq
    const gabung = proyekqq + `,` + rabqq

    try {
        let res = await axios({
            method: 'PUT',
            url: `http://localhost:5000/rab/${id}`,
            data: gabung,
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        })
        console.log(`Status code: ${res.status}`);
        console.log(`Status text: ${res.statusText}`);

    } catch (error) {
        return error
    }
}