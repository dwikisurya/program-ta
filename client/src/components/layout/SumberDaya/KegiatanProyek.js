import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Swal from 'sweetalert2'

import ModalKegiatanProyek from './ModalKegiatanProyek'
import _ from 'lodash'
import dateFormat from 'dateformat'
import MaterialTable from "material-table"

import hitkegiatan from '../../client/sumberdaya/kegiatanproyek.get'
import postkegiatan from '../../client/sumberdaya/kegiatanproyek.post'
import deletekegiatan from '../../client/sumberdaya/kegiatanproyek.delete'

const KegiatanProyek = () => {

    // State Get
    const [kegiatanProyek, setkegiatanData] = useState([])

    var dataqq = _.map(kegiatanProyek, function (group) {
        return {
            id: group._id,
            namaKegiatan: group.namaKegiatan,
            deskripsiKegiatan: group.deskripsiKegiatan,
            satuanKegiatan: group.satuanKegiatan,
            hargaSatuan: group.hargaSatuan,
            updated_at: dateFormat(group.updated_at, "dd mmmm yyyy")
        }
    });
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


    // State Post
    const [formdata, setformData] = useState({})

    const handlerChange = (e) => {
        setformData(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    const handlerSubmit = (e) => {
        e.preventDefault()
        const a = (Object.keys(formdata).length)
        if (a < 4) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: 'error',
                title: 'Error',
                text: 'Harap isi Field yang kosong',
            })

        } else {
            postkegiatan(formdata)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: 'success',
                title: 'Data telah ditambah'
            }).then(res => {
                getData()
            })
        }
    }

    // Function Delete
    const deleteRow = (id, e) => {
        deletekegiatan(id)
            .then(res => {
                const statekegiatan = kegiatanProyek.filter(_id => kegiatanProyek._id !== id);
                setkegiatanData(statekegiatan)
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                    icon: 'success',
                    title: `Data id:` + id + `telah dihapus`
                })
                getData()
            })
    }

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row" style={{ margin: 10 }}>
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

                    <MaterialTable
                        title="Data Kegiatan Proyek"
                        columns={[
                            { title: "ID", field: "id", hidden: true },
                            { title: "Nama Kegiatan", field: "namaKegiatan" },
                            { title: "Deskripsi Kegiatan", field: 'deskripsiKegiatan' },
                            { title: "Satuan Kegiatan", field: 'satuanKegiatan' },
                            { title: "Harga Satuan", field: 'hargaSatuan' },
                            {
                                title: "Edit",
                                field: "internal_action",
                                editable: false,
                                render: (rowData) =>
                                    rowData && (
                                        <td><ModalKegiatanProyek rowData={rowData} /></td>
                                    )
                            },
                        ]}
                        data={(dataqq)}
                        actions={[
                            {
                                icon: 'delete',
                                tooltip: 'Delete Data',
                                onClick: (e, rowData) => deleteRow(rowData.id, e)
                            }
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

export default KegiatanProyek