import React from 'react'
import Navbar from '../Navbar'

const KegiatanProyek = () => {
    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form role="form">
                        <div className="form-group">
                            <h5>Input Data SDB</h5>
                            nama kegiatan
                            deskripsi
                            satuan
                            harga satuan
                            <label for="inp_namakegiatanproyek">Nama Kegiatan</label>
                            <input type="text" className="form-control" id="inp_namakegiatanproyek" />
                        </div>
                        <div className="form-group">
                            <label for="inp_deksripsikegiatanproyek">Deskripsi Kegiatan</label>
                            <input type="text" className="form-control" id="inp_deksripsikegiatanproyek" />
                        </div>
                        <div className="form-group">
                            <label for="inp_satuankegiatanproyek">Satuan Kegiatan</label>
                            <input type="text" className="form-control" id="inp_satuankegiatanproyek" />
                        </div>
                        <div className="form-group">
                            <label for="inp_hargasatuankegiatanproyek">Harga Satuan</label>
                            <input type="number" className="form-control" id="inp_hargasatuankegiatanproyek" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <div className="col-md-6">
                    <table className="table">
                        <thead>
                            <tr>
                                <th> Product</th>
                                <th> Payment Taken</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> TB - Monthly</td>
                                <td>01/04/2012</td>
                                <td> Default</td>
                            </tr>
                            <tr>
                                <td> TB - Monthly</td>
                                <td>01/04/2012</td>
                                <td> Default</td>
                            </tr>
                            <tr>
                                <td> TB - Monthly</td>
                                <td>01/04/2012</td>
                                <td> Default</td>
                            </tr>
                            <tr>
                                <td> TB - Monthly</td>
                                <td>01/04/2012</td>
                                <td> Default</td>
                            </tr>
                            <tr>
                                <td> TB - Monthly</td>
                                <td>01/04/2012</td>
                                <td> Default</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default KegiatanProyek