import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Swal from 'sweetalert2'

import MaterialTable from "material-table";
import _ from 'lodash'
import dateFormat from 'dateformat'

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

    var dataqq = _.map(proyek, function (group) {
        return {
            id: group._id,
            namaProyek: group.namaProyek,
            clientProyek: group.clientProyek,
            statusProyek: group.statusProyek,
            lokasiProyek: group.lokasiProyek,
            kategoriProyek: group.kategoriProyek.namaKategori,
            projectManager: group.projectManager.namaKaryawan,
            created_at: dateFormat(group.created_at, "dd mmmm yyyy"),
            updated_at: dateFormat(group.updated_at, "dd mmmm yyyy"),
            accepted_at: dateFormat(group.accepted_at, "dd mmmm yyyy"),
            durasiPengerjaan: group.durasiPengerjaan
        }
    });

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
            if (pm.status === 'pm') {
                return (
                    <option key={pm._id} value={pm._id} name={pm._id} >{pm.namaKaryawan}</option>
                )
            }
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
        const a = (Object.keys(formdata).length)
        if (a < 5) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
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
            postproyek(formdata)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
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
        deleteproyek(id)
            .then(res => {
                const stateProyek = proyek.filter(_id => proyek._id !== id);
                setProyek(stateProyek)
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
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
                <div className="col-md-4">
                    <form onSubmit={handlerSubmit}>
                        <div className="form-group">
                            <h5>Input Data Proyek</h5>
                            <label htmlFor="inp_namaproyek">Nama Proyek</label>
                            <input type="text" className="form-control" name="namaProyek" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inp_idpekerjaanrab">Kategori Proyek</label>
                            {/* <Select className="form-control" name="kategoriProyek" options={dataRenderKategori} onInput={option => this.handlerChange(option.value, "id")} /> */}
                            <select className="form-control" name="kategoriProyek" onInput={handlerChange.bind(this)}>
                                <option>     </option>
                                {renderKategori()}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inp_idpekerjaanrab">Project Manager</label>
                            <select className="form-control" name="projectManager" onInput={handlerChange.bind(this)}>
                                <option>     </option>
                                {renderPM()}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inp_clientproyek">Client</label>
                            <input type="text" className="form-control" name="clientProyek" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inp_lokasiproyek">Lokasi</label>
                            <input type="text" className="form-control" name="lokasiProyek" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inp_durasipengerjaan">Lama Durasi Pengerjaan</label>
                            <input type="number" className="form-control" name="durasiPengerjaan" onInput={handlerChange.bind(this)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>


                    </form>
                </div>

                <div className="col-md-8">
                    <MaterialTable
                        title="Data Proyek"
                        columns={[
                            { title: "ID", field: "id", hidden: true },
                            { title: "Nama Proyek", field: "namaProyek" },
                            { title: "Kategori Proyek", field: "kategoriProyek", defaultGroupOrder: 0 },
                            { title: "Client", field: "clientProyek", defaultGroupOrder: 1 },
                            { title: "Lokasi", field: "lokasiProyek", defaultGroupOrder: 2 },
                            { title: "Status", field: "statusProyek" },
                            { title: "Project Manager", field: "projectManager" },
                            { title: "Created At", field: "created_at" },
                            { title: "Durasi Pengerjaan / Hari", field: "durasiPengerjaan" },
                            {
                                title: "Edit",
                                field: "internal_action",
                                editable: false,
                                render: (rowData) =>
                                    rowData && (
                                        <td><ModalProyek rowData={rowData} /></td>
                                    )
                            },
                        ]}
                        data={(dataqq)}
                        options={{
                            grouping: true
                        }}
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
        </div >
    )
}

export default Proyek