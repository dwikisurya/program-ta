import React, { Fragment, useState } from 'react'
import putsdm from '../../client/sumberdaya/sdmanusia.put'


const ModalSDM = ({ datasdm }) => {
    const [sdmdata, setsdbmData] = useState(datasdm)

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
                console.log("Data Berhasil di update")
                window.location = "/";
            } else {
                console.log("Data Gagal di update")
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
                data-target={`#_id${datasdm._id}`}
            >Edit</button>

            <div
                className="modal"
                id={`_id${datasdm._id}`}
                onClick={() => setsdbmData(datasdm)}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Sumber Daya Manusia</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setsdbmData(datasdm)}></button>
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
                                    defaultValue={datasdm.namaKaryawan}
                                    placeholder={datasdm.namaKaryawan}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Tgl Lahir</label></td>
                                <td><input
                                    type="date"
                                    classNameName="form-control"
                                    name="tgl_lahir"
                                    defaultValue={datasdm.tgl_lahir}
                                    placeholder={datasdm.tgl_lahir}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">JK</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="jk"
                                    defaultValue={datasdm.jk}
                                    placeholder={datasdm.jk}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Alamat</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="alamat"
                                    defaultValue={datasdm.alamat}
                                    placeholder={datasdm.alamat}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">No Telp</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="no_telp"
                                    defaultValue={datasdm.no_telp}
                                    placeholder={datasdm.no_telp}
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
                                onClick={() => setsdbmData(datasdm)}
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