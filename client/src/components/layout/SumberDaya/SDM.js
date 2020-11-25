import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'

import hitsdm from '../../client/sumberdaya/sdmanusia.get'
import postsdm from '../../client/sumberdaya/sdmanusia.post'
import deletesdm from '../../client/sumberdaya/sdmanusia.delete'
import ModalSDM from './ModalSDM'

const SDM = () => {

    // State Get SDM
    const [sdmData, setsdmData] = useState([])

    // Useeffect untuk ambil data, dari client dimasukkan ke state diatas
    const getData = async () => {
        const sdm = await hitsdm()
        if (sdm.status === 200) {
            setsdmData(sdm.data)
        } else {
            console.log(sdm)
        }
    }

    useEffect(() => {
        getData()
    }, [])


    const rendertable = () => {
        return sdmData.map(datasdm => {
            return (
                <tr key={datasdm._id}>
                    <td>{datasdm.namaKaryawan}</td>
                    <td>{datasdm.tgl_lahir}</td>
                    <td>{datasdm.jk}</td>
                    <td>{datasdm.alamat}</td>
                    <td>{datasdm.no_telp}</td>
                    <td><ModalSDM datasdm={datasdm} /> </td>
                    <td>
                        <button className="btn-sm btn-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete"
                            onClick={(e) => deleteRow(datasdm._id, e)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    // State Post SDM
    const [formdata, setformData] = useState({})

    const handlerChange = (e) => {
        setformData(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    const handlerSubmit = (e) => {
        e.preventDefault()
        if (formdata !== null) {
            console.log('Succes')
            postsdm(formdata)
            window.location = "/"
        } else {
            console.log('Error')
        }
    }

    // Delete Function
    const deleteRow = (id, e) => {
        deletesdm(id)
            .then(res => {
                const statesdm = sdmData.filter(_id => sdmData._id !== id);
                setsdmData(statesdm)
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
                            <h5>Input Data SDM</h5>
                            <label for="inp_namakaryawan">Nama Karyawan</label>
                            <input type="text" className="form-control" name="namaKaryawan" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_tgllahir">Tanggal Lahir</label>
                            <input type="date" className="form-control" name="tgl_lahir" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_jk">Jenis Kelamin</label>
                            <input type="text" className="form-control" name="jk" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_alamat">Alamat</label>
                            <input type="text" className="form-control" name="alamat" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_notelp">No.Telepon</label>
                            <input type="text" className="form-control" name="no_telp" onInput={handlerChange.bind(this)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                <div className="col-md-6">
                    <table className="table table-responsive-md" id="datasdm">
                        <thead>
                            <tr>
                                <th>Nama Barang</th>
                                <th>Tanggal Lahir</th>
                                <th>JK</th>
                                <th>Alamat</th>
                                <th>No Telp</th>
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

export default SDM