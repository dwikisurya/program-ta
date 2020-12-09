import React, { useEffect, useState, Fragment } from 'react'
import Navbar from '../Navbar'
import dateFormat from 'dateformat'
import _ from 'lodash'
import MaterialTable from "material-table"

import hitscheduling from '../../client/proyek/scheduling.get'
import postscheduling from '../../client/proyek/scheduling.post'
import deletescheduling from '../../client/proyek/scheduling.delete'

import hitrab from '../../client/proyek/rab.get'

const Scheduling = () => {

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
            bobotKegiatan: group.bobotKegiatan.toFixed(2),
            bobotPekerjaan: group.bobotPekerjaan.toFixed(2),
            perkiraanDurasi: group.perkiraanDurasi.toFixed(0),
            created_at: dateFormat(group.created_at, "dd mmmm yyyy")
        }
    });

    const rendertable = () => {
        return scheduling.map(sch => {
            return (
                <tr key={sch._id}>
                    <td>{sch.idRabProyek.idProyek.namaProyek}</td>
                    <td>{rab.map(rabq => {
                        if (rabq._id === sch.idRabProyek._id) {
                            return (
                                <tr><th>Uraian Pekerjaan</th>
                                    <td>{rabq.rab.map(q1 => {
                                        return (<tr><td>{q1.uraianPekerjaan}</td>
                                        </tr>
                                        )
                                    })}
                                    </td>
                                    <td>{sch.sch.map(q2 => {
                                        return (<tr><td>{q2.perkiraanDurasi + " Hari"}</td></tr>)
                                    })}</td>
                                    <td>{sch.sch.map(schq => {
                                        let today = dateFormat(schq.tglKerja, "dd mmmm yyyy")
                                        return (<tr><td>{today}</td></tr>)
                                    })}</td>

                                </tr>
                            )
                        }
                    })}</td>
                    <td>   <button className="btn-sm btn-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete"
                        onClick={(e) => deleteRow(sch._id, e)}>Delete</button></td>
                </tr>
            )
        })
    }

    // Populate Dropdwon Id RAB Proyek untuk form
    const renderRAB = () => {
        return rab.map(rabq => {
            return (
                <option key={rabq._id} value={rabq._id} name='idRAB' label={rabq.idProyek.namaProyek}></option>
            )
        })
    }

    // State menyimpan id rab darifrom
    const [formRAB, setDataformrab] = useState([])

    const handlerChange = (e) => {
        // ambil idrab
        setDataformrab(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    // Form Disini

    const [formdata, setFormData] = useState([
        { perkiraanDurasi: '', tglKerja: '', uraianPekerjaan: '', bobotKegiatan: '', bobotPekerjaan: '' }
    ]);

    const handleInputChange = (index, event) => {
        const values = [...formdata];
        let i = 0
        let j = 0
        let k = 0
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

    const handleSubmit = e => {
        e.preventDefault();

        var groups1 = _.groupBy(rab, function (value) {
            return value.idRabProyek;
        });

        console.log(groups1)

        var data = _.map(groups1, function (group) {
            return {
                namaProyek: group[0].idRabProyek.idProyek.namaProyek,
                count: _.countBy(group, 'idRabProyek.idProyek.namaProyek')
            }
        });


        console.log(data)

        // if (formdata !== null && formRAB !== null) {
        //     console.log('Success')
        //     const idRAB = formRAB.idRabProyek
        //     postscheduling(formdata, idRAB)
        //     window.location = "/"
        // } else {
        //     console.log('Error')
        // }
    };

    // Delete
    const deleteRow = (id, e) => {
        deletescheduling(id)
            .then(res => {
                const schdulingq = scheduling.filter(_id => scheduling._id !== id);
                setScheduling(schdulingq)
                console.log('Data telah dihapus')
                getData()
            })
    }

    useEffect(() => {
        getData()
        getRab()
    }, [])


    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="row clearfix">
                    <div className="col-md-5">
                        <h5>Input Scheduling</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <label htmlFor="idProyek">RAB</label>
                                <select className="form-control" id="idRabProyek" name="idRabProyek" onChange={handlerChange}>
                                    <option value="">     </option>
                                    {renderRAB()}
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

                    </div>



                    <div className="col-md-7">
                        <table className="table table-responsive-md" id="Proyek">
                            <thead>
                                <tr>
                                    <th className="text-center">Nama Proyek</th>
                                    <th className="text-center">Uraian / Durasi</th>
                                </tr>
                            </thead>
                            <tbody>{rendertable()}</tbody>
                        </table>
                        <MaterialTable
                            title="Data RAB"
                            columns={[
                                { title: "ID", field: "id", hidden: true },
                                { title: "Nama Proyek", field: "namaProyek", defaultGroupOrder: 0 },
                                { title: "Uraian", field: "uraian", defaultGroupOrder: 0 },
                                { title: "Tanggal Kerja", field: "tglKerja" },
                                { title: "Perkiraan Durasi", field: "perkiraanDurasi" },
                                { title: "Bobot Pekerjaan", field: "bobotPekerjaan" },
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
        </div>
    )
}

export default Scheduling