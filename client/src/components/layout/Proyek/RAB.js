import React, { useState, useEffect, Fragment } from 'react'
import Navbar from '../Navbar'
import ModalRAB from './ModalRAB'

import hitrab from '../../client/proyek/rab.get'
import deleterab from '../../client/proyek/rab.delete'
import postrab from '../../client/proyek/rab.post'

import hitproyek from '../../client/proyek/proyek.get'
import hitpekerjaan from '../../client/sumberdaya/kegiatanproyek.get'

const RAB = () => {

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

    const rendertable = () => {
        return rab.map(rabq => {
            return (
                <tr>
                    <td>{rabq.idProyek.namaProyek}</td>
                    <td>{rabq.rab.map(q1 => {
                        return (
                            <tr>
                                <th>Uraian</th>
                                <td>{q1.uraianPekerjaan}</td>
                                <th>Kegiatan</th>
                                <td>
                                    {q1.idKegiatanProyek.map(q2 => {
                                        return (<td>{q2.namaKegiatan}</td>)
                                    })}</td>
                            </tr>
                        )
                    })}</td>
                    <td>{rabq.status}</td>
                    <td><ModalRAB datarab={rabq} /></td>
                    <td>   <button className="btn-sm btn-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete"
                        onClick={(e) => deleteRow(rabq._id, e)}>Delete</button></td>
                </tr>
            )
        })
    }

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
            return (
                <option key={proyeku._id} value={proyeku._id} name='idProyek' label={proyeku.namaProyek}></option>
            )
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
        { uraianPekerjaan: '', idKegiatanProyek: {}, hargaKegiatan: {}, volume: '', totalHarga: '' }
    ]);

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
            values[index].hargaKegiatan = Array.from(event.target.selectedOptions, option => parseInt(option.attributes.getNamedItem("data-valuea").value))
        } if (event.target.name === "volume") {
            values[index].volume = Array.from(event.target.value.split(','))
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
        console.log("idproyek", formproyek)
        console.log("rab", formdata);
        if (formdata !== null && formproyek !== null) {
            console.log('Success')
            const idform = formproyek.idProyek
            postrab(formdata, idform)
            window.location = "/"
        } else {
            console.log('Error')
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


    // Delete
    const deleteRow = (id, e) => {
        deleterab(id)
            .then(res => {
                const rabq = rab.filter(_id => rab._id !== id);
                setRab(rabq)
                console.log('Data telah dihapus')
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
                <div className="row clearfix">

                    <div className="col-md-6">
                        <h5>Input RAB</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <label htmlFor="idProyek">ID Proyek</label>
                                <select className="form-control" id="idProyek" name="idProyek" onChange={handlerChange}>
                                    <option value="">     </option>
                                    {renderProyek()}
                                </select>

                                {formdata.map((formdataq, index) => (
                                    <Fragment key={`${formdataq}~${index}`}>
                                        <div className="form-group col-sm-4">
                                            <label htmlFor="volume">Id Pekerjaan</label>
                                            <select multiple class="form-control" id="idPekerjaan" name="idPekerjaan" onChange={event => handleInputChange(index, event)}>
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
                                            />
                                        </div>





                                        <div className="form-group col-sm-2">
                                            <button
                                                className="btn btn-link"
                                                type="button"
                                                onClick={() => handleRemoveFields(index)}
                                            >
                                                -
                    </button>
                                            <button
                                                className="btn btn-link"
                                                type="button"
                                                onClick={() => handleAddFields()}
                                            >
                                                +
                    </button>
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                            <div className="submit-button">
                                <button
                                    className="btn btn-primary mr-2"
                                    type="submit"

                                >
                                    Save
            </button>
                            </div>
                        </form>

                    </div>

                    <div className="col-md-6">
                        <table className="table table-responsive-md" id="Proyek">
                            <thead>
                                <tr>
                                    <th>Nama Proyek</th>
                                    <th>Uraian</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>{rendertable()}</tbody>
                        </table>
                    </div>
                </div>
            </div >
        </div >
    );

}

export default RAB