import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Swal from 'sweetalert2'
import _ from 'lodash'
import dateFormat from 'dateformat'

import ModalBiaya from './ModalBiaya'
import MaterialTable from "material-table"

import hitbiaya from '../../client/sumberdaya/biayarole.get'
import postbiaya from '../../client/sumberdaya/biayarole.post'
import deletebiaya from '../../client/sumberdaya/biayarole.delete'

const BiayaRole = () => {
    // State Get
    const [biayarole, setbiayaroleData] = useState([])
    const getBiaya = async () => {
        const biaya = await hitbiaya()
        if (biaya.status === 200) {
            setbiayaroleData(biaya.data)
        } else {
            console.log(biaya)
        }
    }
    useEffect(() => {
        getBiaya()
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
            postbiaya(formdata)
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
                getBiaya()
            })
            return
        }
    }

    // Delete Function
    const deleteRow = (id, e) => {
        deletebiaya(id)
            .then(res => {
                const statebiaya = biayarole.filter(_id => biayarole._id !== id);
                setbiayaroleData(statebiaya)
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
                getBiaya()
            })
    }
    const resultBiayaRole = _.map(biayarole, function (group) {
        return {
            namaRole: group.namaRole,
            biayaRole: group.hargaBiaya,
            tgl: dateFormat(group.updated_at, "dd-mm-yyyy"),
        }
    });

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row" style={{ margin: 10 }}>
                <div className="col-md-6">
                    <form onSubmit={handlerSubmit}>
                        <div className="form-group">
                            <h5>Input Data Biaya / Jam Unutk Role Masing-Masing</h5>
                            <label for="inp_status">Role</label>
                            <input type="text" className="form-control" name="namaRole" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_deskripsikategori">Harga Biaya /Jam (di penyelesaian proyek)</label>
                            <input type="text" className="form-control" name="hargaBiaya" onInput={handlerChange.bind(this)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                <div className="col-md-6">
                    <MaterialTable
                        title="Data Biaya Role"
                        columns={[
                            { title: "ID", field: "_id", hidden: true },
                            { title: "Role", field: "namaRole" },
                            { title: "Harga Biaya /Jam", field: 'biayaRole' },
                            { title: "Updated at", field: 'tgl' },
                            {
                                title: "Edit",
                                field: "internal_action",
                                editable: false,
                                render: (rowData) =>
                                    rowData && (
                                        <td><ModalBiaya rowData={rowData} /></td>
                                    )
                            },
                        ]}
                        data={(resultBiayaRole)}
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

export default BiayaRole