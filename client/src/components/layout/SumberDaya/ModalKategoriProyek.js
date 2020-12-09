import React, { Fragment, useState } from 'react'
import putkategori from '../../client/sumberdaya/kategoriproyek.put'


const ModalKategoriProyek = ({ rowData }) => {
    const [kategoriProyek, setkategoriData] = useState(rowData)

    // Handler Change
    const handlerChange = (e) => {
        setkategoriData(kategoriproyek => ({ ...kategoriproyek, [e.target.name]: e.target.value }));
    }

    const updateDescription = async (e) => {
        e.preventDefault();
        try {
            if (kategoriProyek !== null) {
                console.log(kategoriProyek)
                putkategori(kategoriProyek)
                alert("Data berhasil di update")
                window.location = "/sumberdaya/kategori";
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
                data-target={`#_id${kategoriProyek._id}`}
            >Edit</button>

            <div
                className="modal"
                id={`_id${kategoriProyek._id}`}
                onClick={() => setkategoriData(kategoriProyek)}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Kategori Proyek</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setkategoriData(kategoriProyek)}></button>
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
                                    name="namaKategori"
                                    defaultValue={kategoriProyek.namaKategori}
                                    placeholder={kategoriProyek.namaKategori}
                                    onInput={handlerChange.bind(this)}
                                /></td>
                            </tr>
                            <tr>
                                <td><label for="namaBarang">Deskripsi Kategori</label></td>
                                <td><input
                                    type="text"
                                    classNameName="form-control"
                                    name="deskripsiKategori"
                                    defaultValue={kategoriProyek.deskripsiKategori}
                                    placeholder={kategoriProyek.deskripsiKategori}
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
                                onClick={() => setkategoriData(kategoriProyek)}
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
export default ModalKategoriProyek