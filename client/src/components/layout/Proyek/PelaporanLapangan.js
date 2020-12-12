import React, { useState, useEffect, Fragment } from 'react'
import Navbar from '../Navbar'
import _, { values } from 'lodash'
import MaterialTable from "material-table"

import hitpelaporan from '../../client/proyek/perkembangan.get'
import postpelaporan from '../../client/proyek/perkembangan.post'
import deletepelaporan from '../../client/proyek/perkembangan.delete'

import hitscheduling from '../../client/proyek/scheduling.get'
import hitrab from '../../client/proyek/rab.get'
import hitsdb from '../../client/sumberdaya/sdbarang.get'
import hitsdm from '../../client/sumberdaya/sdmanusia.get'

const PelaporanLapangan = () => {

    // Get Data to Table
    const [pelaporan, setPelaporan] = useState([])
    const getData = async () => {
        const pelaporanHit = await hitpelaporan()
        if (pelaporanHit.status = 200) {
            setPelaporan(pelaporanHit.data)
        } else {
            console.log('Error')
        }
    }

    // Get Data Scheduling
    const [scheduling, setScheduling] = useState([])
    const getScheduling = async () => {
        const schHit = await hitscheduling()
        if (schHit.status = 200) {
            setScheduling(schHit.data)
        } else {
            console.log('Error')
        }
    }
    const [rab, setRab] = useState([])
    const getRab = async () => {
        const rabhit = await hitrab()
        if (rabhit.status = 200) {
            setRab(rabhit.data)
        } else {
            console.log('Error')
        }
    }

    // Ambil Data GroupBy idscheduling dan uraiannya ap
    var groups1 = _.groupBy(pelaporan, function (value) {
        return value._id + '*' + value.idSchedulingProyek._id + '#' + value.uraian;
    });

    var result = _.map(groups1, function (group) {
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
            created_at: group[0].created_at
        }
    });

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
            return (
                <option key={sch._id} value={sch._id} name='idSchedulingProyek' label={sch.idRabProyek.idProyek.namaProyek}></option>
            )
        })
    }

    // Form Input
    const [formdata, setDataForm] = useState([
        { idSchedulingProyek: '', uraian: '', idSDM: {}, idSDB: {}, persentase: '' }
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
        setDataForm(values)
    }

    const handleSubmit = e => {
        e.preventDefault();
        var groups1 = _.groupBy(pelaporan, function (value) {
            return value.idSchedulingProyek._id + '#' + value.uraian;
        });

        var data = _.map(groups1, function (group) {
            return {
                id: group[0]._id,
                idSchedulingProyek: group[0].idSchedulingProyek,
                namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
                uraian: group[0].uraian,
                count: _.countBy(group, 'uraian'),
            }
        });
        console.log(data)

        let a = formdata[0].uraian
        let b = 0
        let c = 0

        data.map(d1 => {
            if (formdata[0].idSchedulingProyek === d1.idSchedulingProyek._id && formdata[0].uraian === d1.uraian) {
                return b = d1.count[a]
            }
        })

        scheduling.map(sch => {
            sch.sch.map(schq => {
                if (schq.uraianPekerjaan[0] === a)
                    return c = schq.perkiraanDurasi
            })
        })

        if (b < c) {
            alert('Berhasil menambah data pelaporan')
            postpelaporan(formdata[0])
            window.location = "/pelaporan"
        } else {
            alert(`Data Tidak Boleh Kosong atau\nData Uraian:` + a + ` sudah terpenuhi\nSilahkan isi data perkembangan yang lain`)
        }


    };
    const deleteRow = (id, e) => {
        deletepelaporan(id)
            .then(res => {
                const statePelaporan = pelaporan.filter(_id => pelaporan._id !== id);
                setPelaporan(statePelaporan)
                alert('Data telah dihapus')
                getData()
            })
    }

    useEffect(() => {
        getData()
        getScheduling()
        getRab()
        getSDB()
        getSDM()
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
                            { title: "ID", field: "id" },
                            { title: "ID", field: "idSchedulingProyek._id", hidden: true },
                            { title: "Nama Proyek", field: "idSchedulingProyek.idRabProyek.idProyek.namaProyek", defaultGroupOrder: 0 },
                            { title: "Uraian", field: "uraian", defaultGroupOrder: 0 },
                            { title: "Sumber Daya Digunakan", field: "idSDB" },
                            { title: "Sumber Daya Bekerja", field: "idSDM" },
                            { title: "Persentase", field: "persentase" },
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