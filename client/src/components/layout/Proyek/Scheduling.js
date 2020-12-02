import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'

import hitscheduling from '../../client/proyek/scheduling.get'

import hitrab from '../../client/proyek/rab.get'

const Scheduling = () => {

    // Get Data to Table
    const [scheduling, setScheduling] = useState([])

    const getData = async () => {
        const schHit = await hitscheduling()
        if (schHit.status = 200) {
            setScheduling(schHit.data)
            console.log(schHit.data)
        } else {
            console.log('Error')
        }
    }

    // Get data rab
    const [rab, setRab] = useState([])

    const getRab = async () => {
        const rabhit = await hitrab()
        if (rabhit.status = 200) {
            setRab(rabhit.data)
        } else {
            console.log('Error')
        }
    }

    const rendertable = () => {
        return scheduling.map(sch => {
            return (
                <tr key={sch._id}>
                    <td>{sch.idRabProyek.idProyek.namaProyek}</td>
                    <td>
                        {rab.map(rabq => {
                            return (
                                <tr><th>Uraian Pekerjaan</th>
                                    <td>{rabq.rab.map(q1 => {
                                        return (<tr><td>{q1.uraianPekerjaan}</td>
                                            <td>{sch.sch[q1].perkiraanDurasi}</td>
                                        </tr>
                                        )
                                    })}
                                    </td>
                                    <td>{sch.sch.map(q2 => {
                                        return (<tr><td>{q2.perkiraanDurasi}</td></tr>)
                                    })}</td>
                                </tr>
                            )
                        })}
                    </td>
                </tr>
            )
        })
    }


    useEffect(() => {
        getData()
        getRab()
    }, [])


    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form role="form">
                        <div className="form-group">
                            <h5>Input Data Scheduling</h5>
                            <label for="inp_idrabscheduling">Data RAB (ambil uraian pekerjaan / simpan uraianpekerjaan ke db)</label>
                            <select className="form-control" name="idProyek">
                                <option>     </option>

                            </select>
                        </div>
                        <div className="form-group">
                            <label for="inp_durasischeduling">Perkiraan Durasi</label>
                            <input type="number" className="form-control" id="inp_durasischeduling" />
                        </div>
                        <div className="form-group">
                            <label for="inp_tglscheduling">Tanggal Kerja</label>
                            <input type="date" className="form-control" id="inp_tglscheduling" />
                        </div>
                        <div className="form-group">
                            <label for="inpt_bobotpekerjaanscheduling">Bobot Pekerjaan (Harga/Totalharga*100 ambil dari tabel rab)</label>
                            <input type="number" className="form-control" id="inpt_bobotpekerjaanscheduling" />
                        </div>
                        <div className="form-group">
                            <label for="inpt_bobotkegiatanscheduling">Bobot Kegiatan (Bobot Pekerjann/Durasi)</label>
                            <input type="number" className="form-control" id="inpt_bobotkegiatanscheduling" />
                        </div>
                        <button type="submit" className="btn btn-primary">New Form</button>
                        <button type="submit" className="btn btn-primary">Simpan</button>
                    </form>
                </div>
                <div className="col-md-6">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center">Nama Proyek</th>
                                <th className="text-center">Kegiatan RAB</th>
                            </tr>
                        </thead>
                        <tbody>{rendertable()}</tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Scheduling