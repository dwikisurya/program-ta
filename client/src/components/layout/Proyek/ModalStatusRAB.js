import React, { Fragment, useState, useEffect } from 'react'

import hitproyek from '../../client/proyek/proyek.get'
import hitpekerjaan from '../../client/sumberdaya/kegiatanproyek.get'

import putrab from '../../client/proyek/rab.put'

const ModalStatusRAB = ({ rowData }) => {
    const [rab, setRab] = useState(rowData)

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


    const updateDescription = async (e) => {
        e.preventDefault();
        try {
            if (formdata !== null && formproyek !== null) {
                putrab(formdata, formproyek.idProyek, rowData.id)
                alert(`Berhasil Update data RAB`)
                window.location = "/proyek/rab"
            } else {
                alert(`Data RAB sudah dibuat, silahkan edit atau tambahkan data RAB lainnya`)
            }
        } catch (err) {
            console.error(err.message);
        }
    };

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


    useEffect(() => {
        getProyek()
        getPekerjaan()
    }, [])



    return (
        <Fragment>
            <button
                type="button"
                className="btn btn-warning"
                data-toggle="modal"
                data-target={`#_id${rowData.id}`}
            >Status</button>

            <div
                className="modal"
                id={`_id${rowData.id}` + "AA"}
                onClick={() => setRab(rowData)}
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Status RAB</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setRab(rowData)}></button>
                        </div>

                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="form-row">
                                    <label htmlFor="idProyek">ID Proyek</label>
                                    <select className="form-control" id="idProyek" name="idProyek" onChange={handlerChange}>
                                        <option value="">     </option>
                                        {renderProyek()}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-warning"
                                data-dismiss="modal"
                                onClick={e => updateDescription(e)}
                            >
                                Update Status
  </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                                onClick={() => setRab(rab)}
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
export default ModalStatusRAB