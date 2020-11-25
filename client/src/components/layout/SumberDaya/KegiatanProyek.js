import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'

import ModalKegiatanProyek from './ModalKegiatanProyek'

import hitkegiatan from '../../client/sumberdaya/kegiatanproyek.get'
import postkegiatan from '../../client/sumberdaya/kegiatanproyek.post'
import deletekegiatan from '../../client/sumberdaya/kegiatanproyek.delete'

const KegiatanProyek = () => {

    // State Get
    const [kegiatanProyek, setkegiatanData] = useState([])

    const getData = async () => {
        const kegiatan = await hitkegiatan()
        if (kegiatan.status === 200) {
            setkegiatanData(kegiatan.data)
        } else {
            console.log(kegiatan)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const rendertable = () => {
        return kegiatanProyek.map(kegiatan => {
            return (
                <tr key={kegiatan._id}>
                    <td>{kegiatan.namaKegiatan}</td>
                    <td>{kegiatan.deskripsiKegiatan}</td>
                    <td>{kegiatan.satuanKegiatan}</td>
                    <td>{kegiatan.hargaSatuan}</td>
                    <td><ModalKegiatanProyek datakegiatan={kegiatan} /></td>
                    <td>
                        <button className="btn-sm btn-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete"
                            onClick={(e) => deleteRow(kegiatan._id, e)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    // State Post
    const [formdata, setformData] = useState({})

    const handlerChange = (e) => {
        setformData(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    const handlerSubmit = (e) => {
        e.preventDefault()
        if (formdata !== null) {
            console.log('Success')
            console.log(formdata)
            postkegiatan(formdata)
            window.location = "/"
        } else {
            console.log('Error')
        }
    }

    // Function Delete
    const deleteRow = (id, e) => {
        deletekegiatan(id)
            .then(res => {
                const statekegiatan = kegiatanProyek.filter(_id => kegiatanProyek._id !== id);
                setkegiatanData(statekegiatan)
                console.log('Data telah dihapus')
                getData()
            })
    }

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form onSubmit={handlerSubmit}>
                        <div className="form-group">
                            <h5>Input Data Kegiatan Proyek</h5>
                            <label for="inp_namakegiatanproyek">Nama Kegiatan</label>
                            <input type="text" className="form-control" name="namaKegiatan" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_deksripsikegiatanproyek">Deskripsi Kegiatan</label>
                            <input type="text" className="form-control" name="deskripsiKegiatan" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_satuankegiatanproyek">Satuan Kegiatan</label>
                            <input type="text" className="form-control" name="satuanKegiatan" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_hargasatuankegiatanproyek">Harga Satuan</label>
                            <input type="number" className="form-control" name="hargaSatuan" onInput={handlerChange.bind(this)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                <div className="col-md-6">
                    <table className="table table-responsive-md" id="kegiatanProyek">
                        <thead>
                            <tr>
                                <th>Nama Kegiatan</th>
                                <th>Deskripsi Kegiatan</th>
                                <th>Satuan Kegiatan</th>
                                <th>Harga Satuan</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>{rendertable()}</tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default KegiatanProyek