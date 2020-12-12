import React, { Fragment, useState } from 'react'
import putsdb from '../../client/sumberdaya/sdbarang.put'

const ModalSDB = ({ rowData }) => {
    const [sdbdata, setSdbdata] = useState(rowData)

    // Handler Change
    const handlerChange = (e) => {
        setSdbdata(sdbdata => ({ ...sdbdata, [e.target.name]: e.target.value }));
    }

    const updateDescription = async (e) => {
        e.preventDefault();
        try {
            if (sdbdata !== null) {
                console.log(sdbdata)
                putsdb(sdbdata)
                alert("Data berhasil di update")
                window.location = "/sumberdaya/barang"
            } else {
                alert("Gagal update data")
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
                data-target={`#_id${rowData._id}`}
            >Edit</button>

            <div
                className="modal"
                id={`_id${rowData._id}`}
                onClick={() => setSdbdata(rowData)}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Sumber Daya Barang</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setSdbdata(rowData)}></button>
                        </div>

                        <div className="modal-body">
                            <table>
                                <th></th>
                                <th></th>
                            </table>
                            <tr>
                                <td><label for="namaBarang">Nama Barang</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="namaBarang"

                                    placeholder={rowData.namaBarang}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="satuanBarang">Satuan Barang</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="satuanBarang"
                                    placeholder={rowData.satuanBarang}
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
                                onClick={() => setSdbdata(rowData)}
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
export default ModalSDB