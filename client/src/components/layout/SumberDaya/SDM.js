import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'

import ModalSDM from './ModalSDM'
import MaterialTable from "material-table"
import _ from 'lodash'
import dateFormat from 'dateformat'

import hitsdm from '../../client/sumberdaya/sdmanusia.get'
import postsdm from '../../client/sumberdaya/sdmanusia.post'
import deletesdm from '../../client/sumberdaya/sdmanusia.delete'

const SDM = () => {

    // State Get SDM
    const [sdmData, setsdmData] = useState([])

    var dataqq = _.map(sdmData, function (group) {
        return {
            id: group._id,
            namaKaryawan: group.namaKaryawan,
            tgl_lahir: dateFormat(group.tgl_lahir, "dd mmmm yyyy"),
            jk: group.jk,
            alamat: group.alamat,
            no_telp: group.no_telp
        }
    });


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
            alert("Success tambah data")
            window.location = "/sumberdaya/manusia"
        } else {
            alert("Harap isi field yang kosong")
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
                            <input type="text" className="form-control" name="namaKaryawan" onInput={handlerChange.bind(this)} required />
                        </div>
                        <div className="form-group">
                            <label for="inp_tgllahir">Tanggal Lahir</label>
                            <input type="date" className="form-control" name="tgl_lahir" onInput={handlerChange.bind(this)} required />
                        </div>
                        <div className="form-group">
                            <label for="inp_jk">Jenis Kelamin</label>
                            <input type="text" className="form-control" name="jk" onInput={handlerChange.bind(this)} required />
                        </div>
                        <div className="form-group">
                            <label for="inp_alamat">Alamat</label>
                            <input type="text" className="form-control" name="alamat" onInput={handlerChange.bind(this)} required />
                        </div>
                        <div className="form-group">
                            <label for="inp_notelp">No.Telepon</label>
                            <input type="text" className="form-control" name="no_telp" onInput={handlerChange.bind(this)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                <div className="col-md-6">
                    <MaterialTable
                        title="Data Sumber Daya Manusia"
                        columns={[
                            { title: "ID", field: "_id", hidden: true },
                            { title: "Nama Karyawan", field: "namaKaryawan" },
                            { title: "Tanggal Lahir", field: 'tgl_lahir' },
                            { title: "Jk", field: 'jk' },
                            { title: "Alamat", field: 'alamat' },
                            { title: "Telepon", field: 'no_telp' },
                            {
                                title: "Edit",
                                field: "internal_action",
                                editable: false,
                                render: (rowData) =>
                                    rowData && (
                                        <td><ModalSDM rowData={rowData} /></td>
                                    )
                            },
                        ]}
                        data={(dataqq)}
                        actions={[
                            {
                                icon: 'delete',
                                tooltip: 'Delete Data',
                                onClick: (e, rowData) => deleteRow(rowData._id, e)
                            },

                        ]}
                        options={{
                            actionsColumnIndex: -1
                        }}
                    />
                </div>
            </div>
        </div>

    )
}

export default SDM