import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import Navbar from '../Navbar'

import hitrab from '../../client/proyek/rab.get'
import deleterab from '../../client/proyek/rab.delete'

import hitproyek from '../../client/proyek/proyek.get'
import hitpekerjaan from '../../client/sumberdaya/kegiatanproyek.get'


const RAB = () => {

    // Form
    const [state, setState] = useState({ rows: [{}] })

    const handleChange = idx => e => {
        const rows = [...state.rows];
        rows[idx] = {
            [e.target.name]: e.target.value,
        };
        setState({
            rows
        });
        console.log(state)
    };

    const handleAddRow = () => {
        const uraianPekerjaan = {
            uraianPekerjaan: "",
            idPekerjaan: "",
            volume: ""
        };
        setState({
            rows: [...state.rows, uraianPekerjaan]
        });
    };

    const handleRemoveSpecificRow = (idx) => () => {
        const rows = [...state.rows]
        rows.splice(idx, 1)
        setState({ rows })
    }

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
                    <td></td>
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
                <option key={pekerjaanku._id} value={pekerjaanku._id} name='idPekerjaan[]'>{pekerjaanku.namaKegiatan}</option>
            )
        })
    }

    // Form
    const [formdata, setformData] = useState([])

    const handlerChange = (e) => {
        setformData(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    const multipleChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value)
        console.log(values)
    }

    const handlerSubmit = (e) => {
        e.preventDefault()
        if (formdata != null) {
            // postproyek(formdata)
            // window.location = "/"
            console.log(formdata)
        } else {
            console.log('Error')
        }
    }

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
                        <h5>Input Data RAB</h5>
                        <form onSubmit={handlerSubmit}>
                            <div className="form-group">
                                <label for="exampleFormControlSelect1">ID Proyek</label>
                                <select className="form-control" name="idProyek" onInput={handlerChange}>
                                    <option>     </option>
                                    {renderProyek()}
                                </select>
                            </div>
                            <table
                                className="table table-bordered table-hover"
                                id="tab_logic" >
                                <thead>
                                    <tr>
                                        <th className="text-center"> Uraian Pekerjaan </th>
                                        <th className="text-center"> Pekerjaan </th>
                                        <th className="text-center"> Volume </th>
                                        <th className="text-center">  </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.rows.map((item, idx) => (
                                        <tr id="addr0" key={idx}>
                                            <td>
                                                <input
                                                    type="text"
                                                    name={`uraianPekerjaan` + [idx]}
                                                    onInput={handlerChange.bind(this)}
                                                    className="form-control"
                                                />
                                            </td>
                                            <td>
                                                <select multiple class="form-control" name={`idPekerjaan`} onInput={multipleChange}>
                                                    <option>     </option>
                                                    {renderPekerjaan()}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name={`volume` + [idx]}
                                                    onInput={handlerChange.bind(this)}

                                                    className="form-control"
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={handleRemoveSpecificRow(idx)}
                                                >
                                                    Remove
                            </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={handleAddRow} className="btn btn-primary">
                                Add Row
                    </button>
                            <button
                                type="submit"
                                className="btn btn-primary float-right"
                            >
                                Submit
                  </button>
                        </form>


                    </div>

                    <div className="col-md-6">
                        <table className="table table-responsive-md" id="Proyek">
                            <thead>
                                <tr>
                                    <th>Nama Proyek</th>
                                    <th>Uraian</th>
                                    <th></th>
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