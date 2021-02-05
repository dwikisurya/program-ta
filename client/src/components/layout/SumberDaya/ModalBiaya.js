import React, { Fragment, useState } from 'react'
import putbiaya from '../../client/sumberdaya/biayarole.put'


const ModalBiaya = ({ rowData }) => {
    const [biayaRole, setbiayaroleData] = useState(rowData)

    // Handler Change
    const handlerChange = (e) => {
        setbiayaroleData(biayaRole => ({ ...biayaRole, [e.target.name]: e.target.value }));
    }

    const updateDescription = async (e) => {
        try {
            if (biayaRole !== null) {
                putbiaya(biayaRole)
                alert("Data berhasil di update")
                window.location = "/sumberdaya/biayarole";
            } else {
                alert("Data gagal di update")
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
                data-target={`#_id${biayaRole._id}`}
            >Edit</button>

            <div
                className="modal"
                id={`_id${biayaRole._id}`}
                onClick={() => setbiayaroleData(biayaRole)}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Biaya Role</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setbiayaroleData(biayaRole)}></button>
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
                                    name="namaRole"
                                    defaultValue={biayaRole.namaRole}
                                    placeholder={biayaRole.namaRole}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Deskripsi Kategori</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="hargaBiaya"
                                    defaultValue={biayaRole.hargaBiaya}
                                    placeholder={biayaRole.hargaBiaya}
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
                                onClick={() => setbiayaroleData(biayaRole)}
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
export default ModalBiaya