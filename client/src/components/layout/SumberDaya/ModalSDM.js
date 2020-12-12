import React, { Fragment, useState } from 'react'
import putsdm from '../../client/sumberdaya/sdmanusia.put'


const ModalSDM = ({ rowData }) => {
    const [sdmdata, setsdbmData] = useState(rowData)
    // Handler Change
    const handlerChange = (e) => {
        setsdbmData(sdmdata => ({ ...sdmdata, [e.target.name]: e.target.value }));
    }

    const updateDescription = async (e) => {
        e.preventDefault();
        try {
            if (sdmdata !== null) {
                console.log(sdmdata)
                putsdm(sdmdata)
                alert("Data Berhasil di update")
                // window.location = "/sumberdaya/manusia"
            } else {
                alert("Data Gagal di update")
            }

        } catch (err) {
            console.error(err.message);
        }
    };

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
                onClick={() => setsdbmData(rowData)}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Sumber Daya Manusia</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setsdbmData(rowData)}></button>
                        </div>

                        <div className="modal-body">
                            <table>
                                <th></th>
                                <th></th>
                            </table>
                            <tr>
                                <td><label for="namaBarang">Nama Karyawan</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="namaKaryawan"

                                    placeholder={rowData.namaKaryawan}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Tgl Lahir</label></td>
                                <td><input
                                    type="date"
                                    classNameName="form-control"
                                    name="tgl_lahir"
                                    placeholder={rowData.tgl_lahir}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">JK</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="jk"
                                    placeholder={rowData.jk}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Alamat</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="alamat"
                                    placeholder={rowData.alamat}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">No Telp</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="no_telp"
                                    placeholder={rowData.no_telp}
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
                                onClick={() => setsdbmData(rowData)}
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
export default ModalSDM