import React, { Fragment, useState } from 'react'
import putkegiatan from '../../client/sumberdaya/kegiatanproyek.put'

const ModalKegiatanProyek = ({ rowData }) => {
    const [kegiatanProyek, setkegiatanData] = useState(rowData)

    // Handler Change
    const handlerChange = (e) => {
        setkegiatanData(kegiatanproyek => ({ ...kegiatanproyek, [e.target.name]: e.target.value }));
    }

    const updateDescription = async (e) => {
        e.preventDefault();
        try {
            if (kegiatanProyek !== null) {
                console.log(kegiatanProyek)
                putkegiatan(kegiatanProyek)
                // console.log("Data Berhasil di update")
                // window.location = "/";
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
                data-target={`#_id${rowData.id}`}
            >Edit</button>

            <div
                className="modal"
                id={`_id${rowData.id}`}
                onClick={() => setkegiatanData(rowData)}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Kategori Proyek</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setkegiatanData(rowData)}></button>
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
                                    name="namaKegiatan"

                                    placeholder={rowData.namaKegiatan}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Deskripsi Kategori</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="deskripsiKegiatan"

                                    placeholder={rowData.deskripsiKegiatan}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Satuan Kegiatan</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="satuanKegiatan"

                                    placeholder={rowData.satuanKegiatan}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Harga Satuan</label></td>
                                <td><input
                                    type="number"
                                    classNameName="form-control"
                                    name="hargaSatuan"

                                    placeholder={rowData.hargaSatuan}
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
                                onClick={() => setkegiatanData(rowData)}
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
export default ModalKegiatanProyek