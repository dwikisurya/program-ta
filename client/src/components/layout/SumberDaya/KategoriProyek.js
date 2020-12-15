import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Swal from 'sweetalert2'

import ModalKategoriProyek from './ModalKategoriProyek'
import MaterialTable from "material-table"

import hitkategori from '../../client/sumberdaya/kategoriproyek.get'
import postkategori from '../../client/sumberdaya/kategoriproyek.post'
import deletekategori from '../../client/sumberdaya/kategoriproyek.delete'

const KategoriProyek = () => {
    // State Get
    const [kategoriProyek, setkategoriData] = useState([])

    const getData = async () => {
        const kategori = await hitkategori()
        if (kategori.status === 200) {
            setkategoriData(kategori.data)
        } else {
            console.log(kategori)
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
        if (a < 2) {
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
            postkategori(formdata)
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
            return
        }
    }

    // Delete Function
    const deleteRow = (id, e) => {
        deletekategori(id)
            .then(res => {
                const statekategori = kategoriProyek.filter(_id => kategoriProyek._id !== id);
                setkategoriData(statekategori)
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
                            <h5>Input Data Kategori Proyek</h5>
                            <label for="inp_kategoriproyek">Kategori Proyek</label>
                            <input type="text" className="form-control" name="namaKategori" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_deskripsikategori">Deskripsi Kategori</label>
                            <input type="text" className="form-control" name="deskripsiKategori" onInput={handlerChange.bind(this)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                <div className="col-md-6">
                    <MaterialTable
                        title="Data Kategori Proyek"
                        columns={[
                            { title: "ID", field: "_id", hidden: true },
                            { title: "Nama Kegiatan", field: "namaKategori" },
                            { title: "Deskripsi Kegiatan", field: 'deskripsiKategori' },
                            {
                                title: "Edit",
                                field: "internal_action",
                                editable: false,
                                render: (rowData) =>
                                    rowData && (
                                        <td><ModalKategoriProyek rowData={rowData} /></td>
                                    )
                            },
                        ]}
                        data={(kategoriProyek)}
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

export default KategoriProyek