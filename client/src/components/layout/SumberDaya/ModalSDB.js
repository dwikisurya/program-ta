import React, { Fragment, useState } from 'react'
import putsdb from '../../client/sumberdaya/sdbarang.put'

const ModalSDB = ({ datasdb }) => {
    const [sdbdata, setSdbdata] = useState(datasdb)

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
                console.log("Data Berhasil di update")
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
                data-target={`#_id${datasdb._id}`}
            >Edit</button>

            <div
                className="modal"
                id={`_id${datasdb._id}`}
                onClick={() => setSdbdata(datasdb)}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Sumber Daya Barang</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setSdbdata(datasdb)}></button>
                        </div>

                        <div className="modal-body">
                            <label for="namaBarang">Nama Barang</label>
                            <input
                                type="text"
                                classNameName="form-control"
                                name="namaBarang"
                                placeholder={datasdb.namaBarang}
                                onInput={handlerChange.bind(this)}
                            /><br></br>
                            <label for="namaBarang">Satuan</label>
                            <input
                                type="text"
                                classNameName="form-control"
                                name="satuanBarang"
                                placeholder={datasdb.satuanBarang}
                                onInput={handlerChange.bind(this)}
                            />
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
                                onClick={() => setSdbdata(datasdb.namaBarang)}
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