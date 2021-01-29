import React, { useState, useEffect, Fragment } from 'react'
import Navbar from '../Navbar'
import _ from 'lodash'
import dateFormat from 'dateformat'
import MaterialTable from "material-table"
import Swal from 'sweetalert2'

import hitpelaporan from '../../client/proyek/perkembangan.get'
import postpelaporan from '../../client/proyek/perkembangan.post'
import deletepelaporan from '../../client/proyek/perkembangan.delete'

import hitscheduling from '../../client/proyek/scheduling.get'
import hitrab from '../../client/proyek/rab.get'
import hitsdb from '../../client/sumberdaya/sdbarang.get'
import hitsdm from '../../client/sumberdaya/sdmanusia.get'
import hitproyek from '../../client/proyek/proyek.get'
import putproyekstatus from '../../client/proyek/proyek.status.put'


const PelaporanLapangan = () => {
    const namaUser = localStorage.getItem('namaUser') || null
    // Get Data to Table
    const [pelaporan, setPelaporan] = useState([])
    const getData = async () => {
        const pelaporanHit = await hitpelaporan()
        if (pelaporanHit.status === 200) {
            setPelaporan(pelaporanHit.data)
        } else {
            console.log('Error')
        }
    }

    // Get Data Scheduling
    const [scheduling, setScheduling] = useState([])
    const getScheduling = async () => {
        const schHit = await hitscheduling()
        if (schHit.status === 200) {
            setScheduling(schHit.data)
        } else {
            console.log('Error')
        }
    }
    const [rab, setRab] = useState([])
    const getRab = async () => {
        const rabhit = await hitrab()
        if (rabhit.status === 200) {
            setRab(rabhit.data)
        } else {
            console.log('Error')
        }
    }

    // Ambil Data GroupBy idscheduling dan uraiannya ap
    const groups1 = _.groupBy(pelaporan, function (value) {
        return value._id + '*' + value.idSchedulingProyek._id + '#' + value.uraian;
    });

    const result = _.map(groups1, function (group) {
        return {
            id: group[0]._id,
            idSchedulingProyek: group[0].idSchedulingProyek,
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            uraian: group[0].uraian,
            persentase: group[0].persentase,
            total: _.sumBy(group, x => x.persentase).toFixed(2),
            count: _.countBy(group, 'uraian'),
            idSDB: group[0].idSDB.map(v => Object.values(v).join('_')).join(','),
            idSDM: group[0].idSDM.map(v => Object.values(v).join('_')).join(','),
            created_at: group[0].created_at,
            status: group[0].status,
            keterangan: group[0].keterangan
        }
    });

    const groups3 = _.groupBy(pelaporan, function (value) {
        return value.idSchedulingProyek._id
    });

    const resultPersentase = _.map(groups3, function (group) {
        return {
            idProyek: group[0].idSchedulingProyek._id,
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            total: _.sumBy(group, x => x.persentase).toFixed(0),
        }
    });

    // Update Status Proyek 
    const [updateProyek, setUpdateDataProyek] = useState({
        status: 'Proyek Selesai'
    })

    // Update Status Proyek Ketika persentase sudah 100 & status != proyek selesai
    function checkPersentase() {
        resultPersentase.map(r1 => {
            proyek.map(p1 => {
                if (r1.total >= 100 && r1.namaProyek === p1.namaProyek) {
                    if (p1.statusProyek !== 'Proyek Selesai') {
                        console.log(p1.namaProyek)
                        let idProyek = p1._id
                        putproyekstatus(idProyek, updateProyek)
                    }
                }
            })
        })
    }

    // Get Data SDB Form
    const [dataSDB, setDataSDB] = useState([])
    const getSDB = async () => {
        const sdbq = await hitsdb()
        if (sdbq.status === 200) {
            setDataSDB(sdbq.data)
        } else {
            console.log('Error')
        }
    }

    // Get Data SDM Form
    const [sdmData, setsdmData] = useState([])
    const getSDM = async () => {
        const sdm = await hitsdm()
        if (sdm.status === 200) {
            setsdmData(sdm.data)
        } else {
            console.log(sdm)
        }
    }

    const renderSDB = () => {
        return dataSDB.map(sdbq => {
            return (
                <option key={sdbq._id} value={sdbq._id} name='sdb'>{sdbq.namaBarang}</option>
            )
        })
    }

    const renderSDM = () => {
        return sdmData.map(sdmq => {
            return (
                <option key={sdmq._id} value={sdmq._id} name='sdm'>{sdmq.namaKaryawan}</option>
            )
        })
    }

    const renderUraian = () => {
        return scheduling.map(sch => {
            if (sch._id === formdata[0].idSchedulingProyek) {
                return sch.sch.map(schq => {
                    return (
                        <option key={schq._id} value={schq.uraianPekerjaan} data-valuea={schq.bobotPekerjaan} name='idSchedulingProyek'>{schq.uraianPekerjaan}</option>
                    )
                })
            } else {
            }
        })
    }

    const renderScheduling = () => {
        return scheduling.map(sch => {
            if (sch.idMandor.namaKaryawan === namaUser) {
                return (
                    <option key={sch._id} value={sch._id} name='idSchedulingProyek' label={sch.idRabProyek.idProyek.namaProyek}></option>
                )
            }
        })
    }

    // Form Input
    const [formdata, setDataForm] = useState([
        { idSchedulingProyek: '', uraian: '', idSDM: {}, idSDB: {}, persentase: '', status: '', keteranganTambahan: 'Tidak ada keterangan tambahan' }
    ])
    const handleInputChange = (index, event) => {
        const values = [...formdata]
        if (event.target.name === "sch") {
            values[index].idSchedulingProyek = event.target.value
        } if (event.target.name === "uraian") {
            values[index].uraian = event.target.value
            let a = Array.from(event.target.selectedOptions, option => parseFloat(option.attributes.getNamedItem("data-valuea").value).toFixed(1))
            values[index].persentase = a.toString()
        } if (event.target.name === "idSDM") {
            values[index].idSDM = Array.from(event.target.selectedOptions, option => option.value)
        } if (event.target.name === "idSDB") {
            values[index].idSDB = Array.from(event.target.selectedOptions, option => option.value)
        }
        if (event.target.name === "keteranganTambahan") {
            values[index].keteranganTambahan = event.target.value;
        }

        setDataForm(values)
    }

    const handleSubmit = e => {
        e.preventDefault();
        const groups1 = _.groupBy(pelaporan, function (value) {
            return value.idSchedulingProyek._id + '#' + value.uraian;
        });

        const data = _.map(groups1, function (group) {
            return {
                id: group[0]._id,
                idSchedulingProyek: group[0].idSchedulingProyek,
                namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
                uraian: group[0].uraian,
                persentase: group[0].persentase,
                count: _.countBy(group, function (a) { if (a.persentase != 0) return a.uraian }),
            }
        })

        // A - uraian
        let a = formdata[0].uraian
        // B - Count Durasi
        let b = 0
        // C - Perkiraan Durasi
        let c = 0

        data.map(d1 => {
            if (formdata[0].idSchedulingProyek === d1.idSchedulingProyek._id && formdata[0].uraian === d1.uraian) {
                if (d1.count[a] === undefined) {
                    return b = 0
                } else {
                    return b = d1.count[a]
                }
            }
        })

        scheduling.map(sch => {
            sch.sch.map(schq => {
                if (schq.uraianPekerjaan[0] === a)
                    return c = schq.perkiraanDurasi
            })
        })

        // Check Date
        const groups2 = _.groupBy(scheduling, function (value) {
            return value._id + '#' + value.idRabProyek.idProyek.namaProyek;
        });

        const dataqq = _.map(groups2, function (group) {
            return {
                id: group[0]._id,
                namaProyek: group[0].idRabProyek.idProyek.namaProyek,
                sch: group[0].sch,
            }
        });

        const result = _.flatMap(dataqq, ({ id, namaProyek, sch }) =>
            _.flatMap(sch, ({ uraianPekerjaan, tglKerja, bobotKegiatan, bobotPekerjaan, perkiraanDurasi }) => ({ id: id, namaProyek: namaProyek, uraian: uraianPekerjaan[0], tglKerja: tglKerja, bobotKegiatan: bobotKegiatan, bobotPekerjaan: bobotPekerjaan, perkiraanDurasi: perkiraanDurasi }))
        )
        const resultq = _.map(result, function (group) {
            return {
                id: group.id,
                namaProyek: group.namaProyek,
                uraian: group.uraian,
                tglKerja: dateFormat(group.tglKerja, "yyyy-mm-dd"),
                perkiraanDurasi: group.perkiraanDurasi,
            }
        })

        const ck_date = resultq.map(rs => {
            if (rs.id === formdata[0].idSchedulingProyek && rs.uraian === a) {
                return rs.perkiraanDurasi
            }
        })

        const dateStart = resultq.map(rs => {
            if (rs.id === formdata[0].idSchedulingProyek && rs.uraian === a) {
                return rs.tglKerja
            }
        })

        //Ambil Hari
        const today = new Date();
        // Durasi dan Date Start
        const ck_durasi = parseInt(ck_date.toString().replace(/,/g, ''))
        const date1 = new Date(dateStart);

        let varDurasi = 0
        if (ck_durasi > 1) {
            varDurasi = ck_durasi - b
        } else {
            varDurasi = 1
        }

        let durasiAkhir = varDurasi * (1000 * 3600 * 24)
        const Difference_In_Time = today.getTime() - (date1.getTime() + durasiAkhir)
        // To calculate the no. of days between two dates 
        const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (Difference_In_Days <= 0) {
            setDataForm(state => (state[0].status = 'Tepat waktu', state))
        } else {
            setDataForm(state => (state[0].status = `Telat ` + Difference_In_Days.toFixed(0) + ` hari`, state))
        }

        if (checked === true) {
            setDataForm(state => (state[0].persentase = 0, state))
            setDataForm(state => (state[0].status = 'Trouble', state))
        }
        console.log({ a, b, c })
        if (b < c) {
            postpelaporan(formdata[0])
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
                window.location.reload(true);
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
                text: `Data Tidak Boleh Kosong atau\nData Uraian:` + a + ` sudah terpenuhi\nSilahkan isi data perkembangan yang lain`,
            })
        }
    }

    const deleteRow = (id, e) => {
        deletepelaporan(id)
            .then(res => {
                const statePelaporan = pelaporan.filter(_id => pelaporan._id !== id);
                setPelaporan(statePelaporan)
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

    const [proyek, setProyek] = useState([])
    const getProyek = async () => {
        const proyekhit = await hitproyek()
        if (proyekhit.status === 200) {
            setProyek(proyekhit.data)
        } else {
            console.log(proyekhit)
        }
    }
    const [checked, setChecked] = useState(false)
    useEffect(() => {
        getData()
        getScheduling()
        getRab()
        getSDB()
        getSDM()
        getProyek()
        checkPersentase()
    }, [])

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row" style={{ margin: 10 }}>
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">

                            {formdata.map((formdataq, index) => (
                                <Fragment key={`${formdataq}~${index}`}>

                                    <div className="form-group col-md-12">
                                        <h5>Input Pelaporan</h5>
                                        <label htmlFor="idProyek">ID Scheduling</label>
                                        <select className="form-control" id="sch" name="sch" onChange={event => handleInputChange(index, event)}>
                                            <option value="">     </option>
                                            {renderScheduling()}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label htmlFor="uraian">Uraian</label>
                                        <select className="form-control" id="uraian" name="uraian" onChange={event => handleInputChange(index, event)}>
                                            <option value="">     </option>
                                            {renderUraian()}
                                        </select>
                                    </div>

                                    <div className="form-group col-sm-6">
                                        <label htmlFor="volume">SDM Bekerja</label>
                                        <select multiple class="form-control" id="idPekerjaan" name="idSDM" onChange={event => handleInputChange(index, event)}>
                                            {renderSDM()}
                                        </select>
                                    </div>

                                    <div className="form-group col-sm-6">
                                        <label htmlFor="volume">SDB Dibawa</label>
                                        <select multiple class="form-control" id="idPekerjaan" name="idSDB" onChange={event => handleInputChange(index, event)} >
                                            {renderSDB()}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label htmlFor="uraian">Keterangan</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="keteranganTambahana"
                                            name="keteranganTambahan"
                                            placeholder="Kosongi jika tidak ada keterangan tambahan"
                                            onChange={event => handleInputChange(index, event)}
                                        />
                                    </div>
                                    <br />
                                    <div className="form-group col-md-12" style={{ marginLeft: 20 }}>
                                        <input type="checkbox" class="form-check-input" id="exampleCheck1" onChange={() => setChecked(!checked)}></input>
                                        <label className="form-check-label" for="exampleCheck1">Check Jika Terjadi Trouble Didalam Pengerjaan</label>
                                    </div>

                                </Fragment>
                            ))}
                        </div>
                        <div className="submit-button">
                            <button
                                className="btn btn-primary mr-2"
                                type="submit"> Save
            </button>

                        </div>
                    </form>
                </div>


                <div className="col-md-6">
                    <MaterialTable
                        title="Data Pelaporan"
                        columns={[
                            { title: "ID", field: "id", hidden: true },
                            { title: "ID", field: "idSchedulingProyek._id", hidden: true },
                            { title: "Nama Proyek", field: "idSchedulingProyek.idRabProyek.idProyek.namaProyek", defaultGroupOrder: 0 },
                            { title: "Uraian", field: "uraian", defaultGroupOrder: 0 },
                            { title: "Sumber Daya Digunakan", field: "idSDB" },
                            { title: "Sumber Daya Bekerja", field: "idSDM" },
                            { title: "Persentase", field: "persentase" },
                            { title: "Status", field: "status" },
                            { title: "Keterangan", field: "keterangan" },
                        ]}
                        data={(result)}
                        options={{
                            grouping: true,
                            actionsColumnIndex: -1
                        }}
                        actions={[
                            {
                                icon: 'delete',
                                tooltip: 'Delete Data',
                                onClick: (e, rowData) => deleteRow(rowData.id, e)
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

export default PelaporanLapangan