import React, { Fragment, useState, useEffect } from 'react'

import putproyek from '../../client/proyek/proyek.put'

import hitkategori from '../../client/sumberdaya/kategoriproyek.get'
import hitsdm from '../../client/sumberdaya/sdmanusia.get'


const ModalProyek = ({ rowData }) => {
    const [proyekData, setProyekData] = useState(rowData)

    // Handler Change
    const handlerChange = (e) => {
        setProyekData(proyek => ({ ...proyek, [e.target.name]: e.target.value }));
    }

    const updateDescription = async (e) => {
        e.preventDefault();
        try {
            if (proyekData !== null) {
                console.log(proyekData)
                putproyek(proyekData)
                alert("Data Berhasil di update")
                window.location = "/proyek"
            } else {
                console.log("Data Gagal di update")
            }
        } catch (err) {
            console.error(err.message);
        }
    };

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
            return (
                <option key={pm._id} value={pm._id} name={pm._id} >{pm.namaKaryawan}</option>
            )
        })
    }

    useEffect(() => {
        getKategori()
        getPM()
    }, [])


    return (
        <Fragment>
            <button
                type="button"
                className="btn btn-warning"
                data-toggle="modal"
                data-target={`#_id${rowData.id}`}
            >Edit</button>

            <div
                className="modal"
                id={`_id${rowData.id}`}
                onClick={() => setProyekData(proyekData)}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Proyek</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setProyekData(proyekData)}></button>
                        </div>

                        <div className="modal-body">
                            <table>
                                <th></th>
                                <th></th>
                            </table>
                            <tr>
                                <td><label for="namaBarang">Nama Kategori</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="namaProyek"
                                    defaultValue={proyekData.namaProyek}
                                    placeholder={proyekData.namaProyek}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="inp_idpekerjaanrab">Kategori Proyek</label></td>
                                <td><select v-model="kategoriProyek" name="kategoriProyek" onInput={handlerChange.bind(this)}>
                                    <option></option>
                                    {renderKategori()}
                                </select></td>
                            </tr>
                            <tr>
                                <td><label for="inp_idpekerjaanrab">Project Manager</label></td>
                                <td><select v-model="projectManager" name="projectManager" onInput={handlerChange.bind(this)}>
                                    <option></option>
                                    {renderPM()}
                                </select></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Client Proyek</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="clientProyek"
                                    defaultValue={proyekData.clientProyek}
                                    placeholder={proyekData.clientProyek}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Lokasi Proyek</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="lokasiProyek"
                                    defaultValue={proyekData.lokasiProyek}
                                    placeholder={proyekData.lokasiProyek}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Status Proyek</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="statusProyek"
                                    defaultValue={proyekData.statusProyek}
                                    placeholder={proyekData.statusProyek}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-warning"
                                data-dismiss="modal"
                                onClick={e => updateDescription(e)}
                            >
                                Edit
              </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                                onClick={() => setProyekData(rowData)}
                            >
                                Close
              </button>
                        </div>
                    </div>
                </div>

            </div>
        </Fragment>

    )
}
export default ModalProyek