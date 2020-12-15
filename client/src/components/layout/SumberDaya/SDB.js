import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Swal from 'sweetalert2'

import ModalSDB from './ModalSDB'
import MaterialTable from "material-table"

import hitsdb from '../../client/sumberdaya/sdbarang.get'
import postsdb from '../../client/sumberdaya/sdbarang.post'
import deletesdb from '../../client/sumberdaya/sdbarang.delete'

const SDB = () => {
    // Ini State GET SDB
    const [sdbData, setsdbData] = useState([])
    // State Post    
    const [formdata, setformData] = useState({})

    const handlerChange = (e) => {
        setformData(formdata => ({ ...formdata, [e.target.name]: e.target.value }));
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
            postsdb(formdata)
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

    // Delete Function
    const deleteRow = (id, e) => {
        deletesdb(id)
            .then(res => {
                const statesdb = sdbData.filter(_id => sdbData._id !== id);
                setsdbData(statesdb)
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

    // Get Data
    const getData = async () => {
        const sdb = await hitsdb()
        if (sdb.status === 200) {
            setsdbData(sdb.data)
        } else {
            console.log(sdb)
        }
    }

    // Useeffect untuk ambil data, dari client dimasukkan ke state diatas
    useEffect(() => {
        getData()
    }, [])


    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row" style={{ margin: 10 }}>
                <div className="col-md-6">
                    <form onSubmit={handlerSubmit}>
                        <div className="form-group">
                            <h5>Input Data SDB</h5>
                            <label htmlFor="namaBarang">Nama Barang</label>
                            <input type="text" className="form-control" name="namaBarang" onInput={handlerChange.bind(this)} />

                        </div>
                        <div className="form-group">
                            <label htmlFor="satuan">Satuan</label>
                            <input type="text" className="form-control" name="satuan" onInput={handlerChange.bind(this)} />

                        </div>
                        <button type="submit" value="Add" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                <div className="col-md-6">
                    <MaterialTable
                        title="Data Sumber Daya Barang"
                        columns={[
                            { title: "ID", field: "_id", hidden: true },
                            { title: "Nama Barang", field: "namaBarang" },
                            { title: "Satuan", field: "satuanBarang" },
                            {
                                title: "Edit",
                                field: "internal_action",
                                editable: false,
                                render: (rowData) =>
                                    rowData && (
                                        <td><ModalSDB rowData={rowData} /></td>
                                    )
                            },
                        ]}
                        data={(sdbData)}
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

export default SDB