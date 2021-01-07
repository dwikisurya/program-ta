import React, { useState, useEffect, Fragment } from 'react'
import Navbar from '../Navbar'
import ModalRAB from './ModalRAB'
import _ from 'lodash'
import MaterialTable from "material-table"
import Swal from 'sweetalert2'

import hitrab from '../../client/proyek/rab.get'
import deleterab from '../../client/proyek/rab.delete'
import postrab from '../../client/proyek/rab.post'

import putrabstatus from '../../client/proyek/rab.status.put'
import putproyekstatus from '../../client/proyek/proyek.status.put'
import hitproyek from '../../client/proyek/proyek.get'
import hitpekerjaan from '../../client/sumberdaya/kegiatanproyek.get'

const RAB = () => {
    const namaUser = localStorage.getItem('namaUser') || null
    const role = localStorage.getItem('role') || null
    // Get
    const [rab, setRab] = useState([])
    const getData = async () => {
        const rabhit = await hitrab()
        if (rabhit.status = 200) {
            setRab(rabhit.data)
        } else {
            console.log('Error')
        }
    }

    // To show data to datatable
    var groups1 = _.groupBy(rab, function (value) {
        return value._id + '#' + value.idProyek.namaProyek;
    });

    var dataqq = _.map(groups1, function (group) {
        return {
            id: group[0]._id,
            idProyek: group[0].idProyek._id,
            namaProyek: group[0].idProyek.namaProyek,
            rab: group[0].rab,
            status: group[0].status
        }
    });

    const huwala = _.flatMap(dataqq, ({ id, idProyek, namaProyek, rab, status, totalHarga }) =>
        _.flatMap(rab, ({ uraianPekerjaan, idKegiatanProyek, totalHarga }) => ({ id: id, idProyek: idProyek, namaProyek: namaProyek, uraian: uraianPekerjaan, idKegiatanProyek: idKegiatanProyek, status: status, totalHarga: totalHarga }))
    )

    const result = _.flatMap(huwala, ({ id, idProyek, namaProyek, uraian, idKegiatanProyek, status, totalHarga }) =>
        _.map(idKegiatanProyek, tag => ({ id, idProyek, namaProyek, uraian, status, totalHarga, ...tag }))
    );
    console.log({ dataqq, huwala, result })
    // Populate Select For Proyek 
    const [dataProyek, setDataProyek] = useState([])
    const getProyek = async () => {
        const proyek = await hitproyek()
        if (proyek.status === 200) {
            setDataProyek(proyek.data)
        } else {
            console.log('Error')
        }
    }

    const renderProyek = () => {
        return dataProyek.map(proyeku => {
            if (proyeku.projectManager.namaKaryawan === namaUser) {
                return (
                    <option key={proyeku._id} value={proyeku._id} name='idProyek' label={proyeku.namaProyek}></option>
                )
            }
        })
    }

    // Populate Select For Pekerjaan 
    const [dataPekerjaan, setDataPekerjaan] = useState([])
    const getPekerjaan = async () => {
        const pekerjaan = await hitpekerjaan()
        if (pekerjaan.status === 200) {
            setDataPekerjaan(pekerjaan.data)
        } else {
            console.log('Error')
        }
    }

    const renderPekerjaan = () => {
        return dataPekerjaan.map(pekerjaanku => {
            return (
                <option key={pekerjaanku._id} value={pekerjaanku._id} data-valuea={pekerjaanku.hargaSatuan} name='idPekerjaan'>{pekerjaanku.namaKegiatan}</option>
            )
        })
    }

    // Form 
    const [formdata, setFormData] = useState([
        { uraianPekerjaan: '', idKegiatanProyek: {}, hargaKegiatan: {}, volume: '', totalHarga: '', grandTotal: '' }
    ]);

    const [updateProyek, setUpdateDataProyek] = useState({
        status: 'RAB Accepted'
    })

    const [updateRAB, setStatusRAB] = useState({ status: 'RAB Accepted' })

    const [formproyek, setFormProyek] = useState([])
    const handlerChange = (e) => {
        setFormProyek(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    const handleInputChange = (index, event) => {
        const values = [...formdata];
        let i = 0
        let j = 0
        if (event.target.name === "idProyek") {
            values.idProyek = event.target.value
        }
        if (event.target.name === "uraianPekerjaan") {
            values[index].uraianPekerjaan = event.target.value;
        } if (event.target.name === "idPekerjaan") {
            values[index].idKegiatanProyek = Array.from(event.target.selectedOptions, option => option.value)
            values[index].hargaKegiatan = Array.from(event.target.selectedOptions, option => parseInt(option.attributes.getNamedItem("data-valuea").value)) || 0
        } if (event.target.name === "volume") {
            values[index].volume = Array.from(event.target.value.split(',')) || 0
        }
        i = values[index].hargaKegiatan
        j = values[index].volume

        var sum = i.map(function (num, idx) {
            return num * j[idx];
        });

        const sumAll = sum.reduce((result, number) => result + number);
        values[index].totalHarga = sumAll
        setFormData(values)
    };

    const handleSubmit = e => {
        e.preventDefault();
        const idform = formproyek.idProyek
        var groups1 = _.groupBy(rab, function (value) {
            return value.idProyek;
        });

        var data = _.map(groups1, function (group) {
            return {
                count: _.countBy(group, 'idProyek.namaProyek')
            }
        });

        var groups2 = _.groupBy(dataProyek, function (value) {
            return value.namaProyek;
        });

        var data1 = _.map(groups2, function (group) {
            return {
                idProyek: group[0]._id,
                namaProyek: group[0].namaProyek,
            }
        });
        let b = ''
        data1.map(d1 => {
            if (idform === d1.idProyek) {
                return b = d1.namaProyek
            }
        })
        let c = ''
        data.map(d1 => {
            return c = d1.count[b]
        })

        if (formdata !== null && formproyek !== null && c < 1 || c === undefined) {
            let total = 0
            for (let i = 0; i < formdata.length; i++) {
                total += formdata[i].totalHarga
            }
            postrab(formdata, idform, total, namaUser)
            console.log(idform)
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
        } else {
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
                text: `Data RAB:` + b + ` sudah dibuat, silahkan edit atau tambahkan data RAB lainnya`,
            })
        }
    };

    const handleAddFields = () => {
        const values = [...formdata];
        values.push({ uraianPekerjaan: '', idKegiatanProyek: {}, hargaKegiatan: {}, volume: '', totalHarga: '' });
        setFormData(values);
    };

    const handleRemoveFields = index => {
        const values = [...formdata];
        values.splice(index, 1);
        setFormData(values);
    };

    // Update Status Proyek
    const updateStatus = (e, id, idproyek) => {
        if (role === 'direktur') {
            putrabstatus(id, updateRAB)
                .then(res => {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'success',
                        title: `RAB id: ` + id + `berhasil di accept!`
                    })
                    putproyekstatus(idproyek, updateProyek)
                    // window.location = '/proyek/rab'
                })

        } else {
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
                title: `Tidak bisa melakukan aksi karena role bukan semestinya.`
            })
        }
    }

    // Delete
    const deleteRow = (id, e) => {
        deleterab(id)
            .then(res => {
                const rabq = rab.filter(_id => rab._id !== id);
                setRab(rabq)
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


    useEffect(() => {
        getData()
        getProyek()
        getPekerjaan()
    }, [])

    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="row clearfix" style={{ margin: 10 }}>

                    <div className="col-md-5">
                        <h5>Input RAB</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <label htmlFor="idProyek">ID Proyek</label>
                                <select className="form-control" id="idProyek" name="idProyek" onChange={handlerChange.bind(this)} required>
                                    <option value="">     </option>
                                    {renderProyek()}
                                </select>

                                {formdata.map((formdataq, index) => (
                                    <Fragment key={`${formdataq}~${index}`}>
                                        <div className="form-group col-sm-4">
                                            <label htmlFor="volume">Id Pekerjaan</label>
                                            <select multiple class="form-control" id="idPekerjaan" name="idPekerjaan" onChange={event => handleInputChange(index, event)} required>
                                                {renderPekerjaan()}
                                            </select>
                                        </div>

                                        <div className="form-group col-sm-2">
                                            <label htmlFor="volume">Volume</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="volume"
                                                name="volume"
                                                value={formdataq.volume}
                                                onChange={event => handleInputChange(index, event)}
                                                required
                                            />
                                        </div>

                                        <div className="form-group col-sm-4">
                                            <label htmlFor="uraianPekerjaan">Uraian Pekerjaan</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="uraianPekerjaan"
                                                name="uraianPekerjaan"
                                                value={formdataq.uraianPekerjaan}
                                                onChange={event => handleInputChange(index, event)}
                                                required
                                            />
                                        </div>

                                        <div className="form-group col-sm-2">
                                            <button
                                                className="btn btn-link"
                                                type="button"
                                                onClick={() => handleRemoveFields(index)}>-</button>
                                            <button
                                                className="btn btn-link"
                                                type="button"
                                                onClick={() => handleAddFields()}> + </button>
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                            <div className="submit-button">
                                <button
                                    className="btn btn-primary mr-2"
                                    type="submit"> Save</button>



                            </div>
                        </form>
                    </div>

                    <div className="col-md-7">
                        <MaterialTable
                            title="Data RAB"
                            columns={[
                                { title: "ID", field: "id", hidden: true },
                                { title: "ID Proyek", field: "idProyek", hidden: true },
                                { title: "Nama Proyek", field: "namaProyek", defaultGroupOrder: 0 },
                                { title: "Uraian", field: "uraian", defaultGroupOrder: 0 },
                                {
                                    title: "Nama Kegiatan", field: "namaKegiatan",
                                },
                                { title: "Total", field: "totalHarga" },
                                {
                                    title: "Edit",
                                    field: "internal_action",
                                    tooltip: 'Edit Data Hanya Berdasar Proyek',
                                    editable: false,
                                    render: (rowData) =>
                                        rowData && (
                                            <td><ModalRAB rowData={rowData} /></td>
                                        )
                                }
                            ]}
                            data={(result)}
                            options={{
                                grouping: true
                            }}
                            actions={[
                                {
                                    icon: 'delete',
                                    tooltip: 'Delete Data',
                                    onClick: (e, rowData) => deleteRow(rowData.id, e)
                                },

                                {

                                    icon: 'check',
                                    tooltip: 'Accept RAB',
                                    onClick: (e, rowData) => updateStatus(e, rowData.id, rowData.idProyek)
                                }
                            ]}
                            options={{
                                actionsColumnIndex: -1
                            }}
                        />
                    </div>
                </div>
            </div >
        </div >

    );

}

export default RAB