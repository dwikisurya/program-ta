import React, { Children, useEffect, useState } from 'react'
import Navbar from '../Navbar'

import hitproyek from '../../client/proyek/proyek.get'
import postproyek from '../../client/proyek/proyek.post'
import deleteproyek from '../../client/proyek/proyek.delete'
import ModalProyek from './ModalProyek'

import hitkategori from '../../client/sumberdaya/kategoriproyek.get'
import hitsdm from '../../client/sumberdaya/sdmanusia.get'

const Proyek = () => {

    // Get Proyek <TABEL>
    const [proyek, setProyek] = useState([])

    const getData = async () => {
        const proyekhit = await hitproyek()
        if (proyekhit.status === 200) {
            setProyek(proyekhit.data)
        } else {
            console.log(proyekhit)
        }
    }

    const rendertable = () => {
        return proyek.map((proyek, index) => {
            return (
                <tr key={proyek._id}>
                    <td>{proyek.namaProyek}</td>
                    <td>{proyek.clientProyek}</td>
                    <td>{proyek.lokasiProyek}</td>
                    <td>{proyek.statusProyek}</td>
                    <td>{proyek.projectManager.namaKaryawan}</td>
                    <td>{proyek.kategoriProyek.namaKategori}</td>
                    <td><ModalProyek dataproyek={proyek} /></td>
                    <td>
                        <button className="btn-sm btn-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete"
                            onClick={(e) => deleteRow(proyek._id, e)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    // Get For Kategori
    const [datakategori, setDataKategori] = useState([])
    const getKategori = async () => {
        const kategori = await hitkategori()
        if (kategori.status === 200) {
            setDataKategori(kategori.data)
        } else {
            console.log(kategori)
        }
    }
    const renderKategori = () => {
        return datakategori.map(kategorii => {
            return (
                <option key={kategorii._id} value={kategorii._id} name={kategorii._id}  >{kategorii.namaKategori}</option>
            )
        })
    }

    // Get for Project Manager
    const [projectmanager, setProjectManager] = useState([])
    const getPM = async () => {
        const pm = await hitsdm()
        if (pm.status === 200) {
            setProjectManager(pm.data)
        } else {
            console.log(pm)
        }
    }
    const renderPM = () => {
        return projectmanager.map(pm => {
            return (
                <option key={pm._id} value={pm._id} name={pm._id} >{pm.namaKaryawan}</option>
            )
        })
    }

    useEffect(() => {
        getData()
        getKategori()
        getPM()
    }, [])

    // Post Data Proyek
    const [formdata, setformData] = useState({})

    const handlerChange = (e) => {
        setformData(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    const handlerSubmit = (e) => {
        e.preventDefault()
        if (formdata != null) {
            postproyek(formdata)
            // window.location = "/"
            console.log(formdata)
        } else {
            console.log('Error')
        }
    }

    // Delete Function
    const deleteRow = (id, e) => {
        deleteproyek(id)
            .then(res => {
                const stateProyek = proyek.filter(_id => proyek._id !== id);
                setProyek(stateProyek)
                console.log('Data telah dihapus')
                getData()
            })
    }

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-4">
                    <form onSubmit={handlerSubmit}>
                        <div className="form-group">
                            <h5>Input Data Proyek</h5>
                            <label for="inp_namaproyek">Nama Proyek</label>
                            <input type="text" className="form-control" name="namaProyek" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_idpekerjaanrab">Kategori Proyek</label>
                            <select className="form-control" name="kategoriProyek" onInput={handlerChange.bind(this)}>
                                <option>     </option>
                                {renderKategori()}
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="inp_idpekerjaanrab">Project Manager</label>
                            <select className="form-control" name="projectManager" onInput={handlerChange.bind(this)}>
                                <option>     </option>
                                {renderPM()}
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="inp_clientproyek">Client</label>
                            <input type="text" className="form-control" name="clientProyek" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_lokasiproyek">Lokasi</label>
                            <input type="text" className="form-control" name="lokasiProyek" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_lokasiproyek">Status Proyek</label>
                            <input type="text" className="form-control" name="statusProyek" onInput={handlerChange.bind(this)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                <div className="col-md-8">
                    <table className="table table-responsive-md" id="Proyek">
                        <thead>
                            <tr>
                                <th>Nama Proyek</th>
                                <th>Client Proyek</th>
                                <th>Lokasi</th>
                                <th>Status</th>
                                <th>Project Manager</th>
                                <th>Kategori Proyek</th>
                            </tr>
                        </thead>
                        <tbody>{rendertable()}</tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

export default Proyek