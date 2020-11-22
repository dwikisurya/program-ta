import React from 'react'
import Navbar from '../Navbar'

const SDM = () => {
    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form role="form">
                        <div className="form-group">
                            <h5>Input Data SDM</h5>
                            <label for="inp_namakaryawan">Nama Karyawan</label>
                            <input type="text" className="form-control" id="inp_namakaryawan" />
                        </div>
                        <div className="form-group">
                            <label for="inp_tgllahir">Tanggal Lahir</label>
                            <input type="date" className="form-control" id="inp_tgllahir" />
                        </div>
                        <div className="form-group">
                            <label for="inp_jk">Jenis Kelamin</label>
                            <input type="text" className="form-control" id="inp_jk" />
                        </div>
                        <div className="form-group">
                            <label for="inp_alamat">Alamat</label>
                            <input type="text" className="form-control" id="inp_alamat" />
                        </div>
                        <div className="form-group">
                            <label for="inp_notelp">No.Telepon</label>
                            <input type="text" className="form-control" id="inp_notelp" />
                        </div>
                        <div className="form-group">
                            <label for="inp_status">Status</label>
                            <input type="text" className="form-control" id="inp_status" />
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

export default SDM