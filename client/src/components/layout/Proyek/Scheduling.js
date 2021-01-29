import React, { useEffect, useState, Fragment } from 'react'
import Navbar from '../Navbar'
import dateFormat from 'dateformat'
import _ from 'lodash'
import MaterialTable from "material-table"
import Swal from 'sweetalert2'

import putproyekstatus from '../../client/proyek/proyek.status.put'
import hitscheduling from '../../client/proyek/scheduling.get'
import postscheduling from '../../client/proyek/scheduling.post'
import deletescheduling from '../../client/proyek/scheduling.delete'

import hitrab from '../../client/proyek/rab.get'
import hitproyek from '../../client/proyek/proyek.get'
import hitsdm from '../../client/sumberdaya/sdmanusia.get'


const Scheduling = () => {
    const namaUser = localStorage.getItem('namaUser') || null
    // Get Data to Table
    const [scheduling, setScheduling] = useState([])

    const getData = async () => {
        const schHit = await hitscheduling()
        if (schHit.status = 200) {
            setScheduling(schHit.data)
        } else {
            console.log('Error')
        }
    }

    // Get data Proyek
    const [dataProyek, setDataProyek] = useState([])
    const getProyek = async () => {
        const proyek = await hitproyek()
        if (proyek.status === 200) {
            setDataProyek(proyek.data)
        } else {
            console.log('Error')
        }
    }

    // Get data rab
    const [rab, setRab] = useState([])
    const getRab = async () => {
        const rabhit = await hitrab()
        if (rabhit.status = 200) {
            setRab(rabhit.data)
        } else {
            console.log('Error')
        }
    }

    // Get Data SDM
    const getSDM = async () => {
        const sdm = await hitsdm()
        if (sdm.status === 200) {
            setsdmData(sdm.data)
        } else {
            console.log(sdm)
        }
    }

    const [sdmData, setsdmData] = useState([])
    // To show data to datatable
    var groups1 = _.groupBy(scheduling, function (value) {
        return value._id + '#' + value.idRabProyek.idProyek.namaProyek;
    });

    var dataqq = _.map(groups1, function (group) {
        return {
            id: group[0]._id,
            namaProyek: group[0].idRabProyek.idProyek.namaProyek,
            sch: group[0].sch,
            created_at: dateFormat(group[0].created_at, "dd mmmm yyyy")
        }
    });

    const result = _.flatMap(dataqq, ({ id, namaProyek, sch, created_at }) =>
        _.flatMap(sch, ({ uraianPekerjaan, tglKerja, bobotKegiatan, bobotPekerjaan, perkiraanDurasi, created_at }) => ({ id: id, namaProyek: namaProyek, uraian: uraianPekerjaan[0], tglKerja: tglKerja, bobotKegiatan: bobotKegiatan, bobotPekerjaan: bobotPekerjaan, perkiraanDurasi: perkiraanDurasi, created_at: created_at }))
    )
    var resultq = _.map(result, function (group) {
        return {
            id: group.id,
            namaProyek: group.namaProyek,
            uraian: group.uraian,
            tglKerja: dateFormat(group.tglKerja, "dd mmmm yyyy"),
            bobotKegiatan: group.bobotKegiatan,
            bobotPekerjaan: group.bobotPekerjaan,
            perkiraanDurasi: group.perkiraanDurasi,
            created_at: dateFormat(group.created_at, "dd mmmm yyyy")
        }
    });

    // Populate Dropdwon Id RAB Proyek untuk form
    const renderRAB = () => {
        return rab.map(rabq => {
            if (namaUser === rabq.posted_by && rabq.status === "RAB Accepted") {
                return (
                    <option key={rabq._id} value={rabq._id} data-valuea={rabq.idProyek.namaProyek} name='idRAB' label={rabq.idProyek.namaProyek}></option>
                )
            }
        })
    }

    // Populate Dropdwon Id Mandor untuk form
    const renderMANDOR = () => {
        return sdmData.map(sdmq => {
            if (sdmq.status === 'mandor') {
                return (
                    <option key={sdmq._id} value={sdmq._id} name='idMandor' label={sdmq.namaKaryawan}></option>
                )
            }

        })
    }

    // State menyimpan id rab darifrom
    const [formRAB, setDataformrab] = useState(
        { idRabProyek: '', namaProyek: '', mandorProyek: '' }
    )

    const handlerChange = (e) => {
        // ambil idrab
        const values = [...formdata];
        if (e.target.name === "idRabProyek") {
            values.idRabProyek = e.target.value
            values.namaProyek = Array.from(e.target.selectedOptions, option => option.attributes.getNamedItem("data-valuea").value)
        }
        if (e.target.name === "mandorProyek") {
            values.mandorProyek = e.target.value
        }
        setDataformrab(values)
        // setDataformrab(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    const [formMandor, setMandor] = useState([])

    const handleMandor = (e) => {
        // ambil id mandor
        setMandor(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    // Form Disini
    const [formdata, setFormData] = useState([
        { perkiraanDurasi: '', tglKerja: '', uraianPekerjaan: '', bobotKegiatan: '', bobotPekerjaan: '' }
    ]);

    const handleInputChange = (index, event) => {
        const values = [...formdata];
        let i = 0
        let j = 0
        if (event.target.name === "uraianPekerjaan") {
            values[index].uraianPekerjaan = Array.from(event.target.selectedOptions, option => option.value)
            let tempHargaKegiatan = Array.from(event.target.selectedOptions, option => parseFloat(option.attributes.getNamedItem("data-valuea").value).toFixed(2))
            let grandTotal = Array.from(event.target.selectedOptions, option => parseFloat(option.attributes.getNamedItem("data-valuec").value).toFixed(2))
            let zxc = (tempHargaKegiatan / grandTotal) * 100
            values[index].bobotKegiatan = zxc

        } if (event.target.name === "tglKerja") {
            values[index].tglKerja = event.target.value
        } if (event.target.name === "perkiraanDurasi") {
            values[index].perkiraanDurasi = event.target.value
        }

        i = values[index].perkiraanDurasi
        j = values[index].bobotKegiatan
        values[index].bobotPekerjaan = (j / i)

        setFormData(values)
    }

    const handleAddFields = () => {
        const values = [...formdata];
        values.push({ perkiraanDurasi: '', tglKerja: '', uraianPekerjaan: '', bobotKegiatan: '', bobotPekerjaan: '' });
        setFormData(values);
    };

    const handleRemoveFields = index => {
        const values = [...formdata];
        values.splice(index, 1);
        setFormData(values);
    };

    // Populate Dropdown Uraian Pekerjaan untuk form
    const renderUraian = () => {
        return rab.map(rabq => {
            if (rabq._id === formRAB.idRabProyek) {
                return (
                    rabq.rab.map(rabqq => {
                        let volume = rabqq.volume.reduce((result, number) => result + number)
                        return (<option key={rabqq._id} value={rabqq.uraianPekerjaan} data-valuea={rabqq.totalHarga} data-valueb={volume} data-valuec={rabq.grandTotal} label={rabqq.uraianPekerjaan}></option>)
                    })
                )
            }
        })
    }

    // Update Status Proyek 
    const [updateProyek, setUpdateDataProyek] = useState({
        status: 'Scheduling Dibuat'
    })

    const handleSubmit = e => {
        e.preventDefault();

        var groups1 = _.groupBy(scheduling, function (value) {
            return value.idRabProyek;
        });
        var data = _.map(groups1, function (group) {
            return {
                namaProyek: group[0].idRabProyek.idProyek.namaProyek,
                count: _.countBy(group, 'idRabProyek._id')
            }
        });

        const idRAB = formRAB.idRabProyek
        const namaProyek = formRAB.namaProyek[0]
        let c = 0
        data.map(d1 => {
            return c = d1.count[idRAB]
        })

        let idProyek = ''
        dataProyek.map(d1 => {
            if (namaProyek === d1.namaProyek) {
                return idProyek = d1._id
            }
        })
        console.log(idProyek)

        if (c < 1 || c === undefined) {
            const idRAB = formRAB.idRabProyek
            const idMandor = formMandor.mandorProyek
            postscheduling(formdata, idRAB, idMandor)
            putproyekstatus(idProyek, updateProyek)

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
                text: `Gagal menambah data scheduling:` + formRAB.idRabProyek + ` karena data sudah ada`,
            })

        }
    };

    // Delete
    const deleteRow = (id, e) => {
        deletescheduling(id)
            .then(res => {
                const schdulingq = scheduling.filter(_id => scheduling._id !== id);
                setScheduling(schdulingq)
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

    const date = new Date();
    const dateStart = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];

    let durasiPengerjaan = 0
    dataProyek.map(p1 => {
        if (formRAB.namaProyek[0] === p1.namaProyek) {
            return durasiPengerjaan = p1.durasiPengerjaan
        }
    })
    let durasiAkhir = durasiPengerjaan * (1000 * 3600 * 24)
    const dateAkhir = new Date(date.getTime() - (date.getTimezoneOffset() * 60000) + durasiAkhir)
        .toISOString()
        .split("T")[0];

    const groupsSCH = _.groupBy(scheduling, function (value) {
        return value._id + '#' + value.idRabProyek.idProyek.namaProyek;
    });

    const mapSCH = _.map(groupsSCH, function (group) {
        return {
            id: group[0]._id,
            namaProyek: group[0].idRabProyek.idProyek.namaProyek,
            sch: group[0].sch,
            created_at: dateFormat(group[0].created_at, "dd mmmm yyyy")
        }
    });

    const dataSch = _.flatMap(mapSCH, ({ id, namaProyek, sch, created_at }) =>
        _.flatMap(sch, ({ uraianPekerjaan, tglKerja, bobotKegiatan, bobotPekerjaan, perkiraanDurasi, created_at }) => ({ id: id, namaProyek: namaProyek, uraian: uraianPekerjaan[0], tglKerja: tglKerja, bobotKegiatan: bobotKegiatan, bobotPekerjaan: bobotPekerjaan, perkiraanDurasi: perkiraanDurasi, created_at: created_at }))
    )
    console.log(dataSch)
    const laporanSch = _.map(dataSch, function (group) {
        return {
            id: group.id,
            namaProyek: group.namaProyek,
            uraian: group.uraian,
            tglKerja: dateFormat(group.tglKerja, "dd mmmm yyyy"),
            bobotKegiatan: group.bobotKegiatan,
            bobotPekerjaan: group.bobotPekerjaan,
            perkiraanDurasi: group.perkiraanDurasi + ' hari',

        }
    });

    const renderinfoScheduling = () => {
        return laporanSch.map(sch => {
            return (
                <tr key={sch._id}>
                    <td>{sch.uraian}</td>
                    <td>{sch.perkiraanDurasi}</td>
                </tr>
            )
        })
    }

    useEffect(() => {
        getData()
        getRab()
        getProyek()
        getSDM()
    }, [])


    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="row clearfix" style={{ margin: 10 }}>
                    <div className="col-md-5">
                        <h5>Input Scheduling</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <label htmlFor="idProyek">RAB</label>
                                <select className="form-control" id="idRabProyek" name="idRabProyek" onChange={handlerChange}>
                                    <option value="">     </option>
                                    {renderRAB()}
                                </select>
                                <label htmlFor="idProyek">Mandor Proyek</label>
                                <select className="form-control" id="mandorProyek" name="mandorProyek" onChange={handleMandor}>
                                    <option value="">     </option>
                                    {renderMANDOR()}
                                </select>

                                {formdata.map((formdataq, index) => (
                                    <Fragment key={`${formdataq}~${index}`}>
                                        <div className="form-group col-sm-4">
                                            <label htmlFor="volume">Uraian Pekerjaan</label>
                                            <select className="form-control" id="uraianPekerjaan" name="uraianPekerjaan" onChange={event => handleInputChange(index, event)}>
                                                <option value="">     </option>
                                                {renderUraian()}
                                            </select>
                                        </div>


                                        <div className="form-group col-sm-2">
                                            <label htmlFor="volume">Durasi</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="perkiraanDurasi"
                                                name="perkiraanDurasi"
                                                value={formdataq.perkiraanDurasi}
                                                onChange={event => handleInputChange(index, event)}
                                            />
                                        </div>

                                        <div className="form-group col-sm-4">
                                            <label htmlFor="uraianPekerjaan">Tanggal Kerja</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                min={dateStart}
                                                max={dateAkhir}
                                                id="tglKerja"
                                                name="tglKerja"
                                                value={formdataq.tglKerja}
                                                onChange={event => handleInputChange(index, event)}
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
                                    type="submit" > Save </button>
                            </div>

                        </form>
                        <br></br>
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">Info</button>
                    </div>



                    <div className="col-md-7">
                        <MaterialTable
                            title="Data Scheduling"
                            columns={[
                                { title: "ID", field: "id", hidden: true },
                                { title: "Nama Proyek", field: "namaProyek", defaultGroupOrder: 0 },
                                { title: "Uraian", field: "uraian", defaultGroupOrder: 0 },
                                { title: "Perkiraan Durasi", field: "perkiraanDurasi" },
                                { title: "Bobot Pekerjaan", field: "bobotPekerjaan" },
                                { title: "Tanggal Kerja", field: "tglKerja" },
                            ]}
                            data={(resultq)}
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

            <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Info Lama Durasi Pengerjaan Proyek</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Berikut adalah lama durasi pengerjaan pengerjaan proyek dari proyek yang sudah dibuat.</p>
                            <table className="table table-bordered" id="info">
                                <thead>
                                    <tr>
                                        <th width="50px">Uraian Pekerjaan</th>
                                        <th>Lama Durasi /Hari</th>
                                    </tr>
                                </thead>
                                <tbody>{renderinfoScheduling()}</tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Scheduling