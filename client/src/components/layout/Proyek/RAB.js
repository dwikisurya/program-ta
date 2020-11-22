import React from 'react'
import Navbar from '../Navbar'

const RAB = () => {
    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form role="form">
                        <div className="form-group">
                            <h5>Input Data RAB</h5>
                            <label for="inp_idproyekrab">Nama Proyek</label>
                            <select id="country" name="country">
                                <option value="australia">Australia</option>
                                <option value="canada">Canada</option>
                                <option value="usa">USA</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="inp_idpekerjaanrab">Client</label>
                            <select id="country" name="country">
                                <option value="australia">Australia</option>
                                <option value="canada">Canada</option>
                                <option value="usa">USA</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="inp_uraianrab">Uraian Pekerjaan</label>
                            <input type="text" className="form-control" id="inp_uraianrab" />
                        </div>
                        <div className="form-group">
                            <label for="inp_volumerab">Volume</label>
                            <input type="number" className="form-control" id="inp_volumerab" />
                        </div>
                        <div className="form-group">
                            <label for="inp_totalhargarab">Total Harga (Volume* ambil data harga dari id pekerjaan_ </label>
                            <input type="number" className="form-control" id="inp_totalhargarab" />
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

export default RAB