import axios from 'axios'

export default async (idform, reqBody) => {
    const hasil = JSON.stringify(reqBody)
    const hasilq = `{"status": ` + hasil + `}`
    console.log(hasilq)
    try {
        let res = await axios({
            method: 'PUT',
            url: `http://localhost:5000/rab/status/${idform}`,
            data: hasilq,
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        })
        console.log(`Status code: ${res.status}`);
        console.log(`Status text: ${res.statusText}`);

    } catch (error) {
        return error, console.log(error)
    }
}