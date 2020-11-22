import React from 'react'
import Navbar from '../Navbar'

const Proyek = () => {
    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form role="form">
                        <div className="form-group">
                            <h5>Input Data Proyek</h5>
                            <label for="inp_namaproyek">Nama Proyek</label>
                            <input type="text" className="form-control" id="inp_namaproyek" />
                        </div>
                        <div className="form-group">
                            <label for="inp_clientproyek">Client</label>
                            <input type="text" className="form-control" id="inp_clientproyek" />
                        </div>
                        <div className="form-group">
                            <label for="inp_lokasiproyek">Lokasi</label>
                            <input type="text" className="form-control" id="inp_lokasiproyek" />
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

export default Proyek