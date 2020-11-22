import React from 'react'
import Navbar from '../Navbar'

const Scheduling = () => {
    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form role="form">
                        <div className="form-group">
                            <h5>Input Data Scheduling</h5>
                            <label for="inp_idrabscheduling">Data RAB (ambil uraian pekerjaan / simpan uraianpekerjaan ke db)</label>
                            <select id="country" name="country">
                                <option value="australia">Australia</option>
                                <option value="canada">Canada</option>
                                <option value="usa">USA</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="inp_durasischeduling">Perkiraan Durasi</label>
                            <input type="number" className="form-control" id="inp_durasischeduling" />
                        </div>
                        <div className="form-group">
                            <label for="inp_tglscheduling">Tanggal Kerja</label>
                            <input type="date" className="form-control" id="inp_tglscheduling" />
                        </div>
                        <div className="form-group">
                            <label for="inpt_bobotpekerjaanscheduling">Bobot Pekerjaan (Harga/Totalharga*100 ambil dari tabel rab)</label>
                            <input type="number" className="form-control" id="inpt_bobotpekerjaanscheduling" />
                        </div>
                        <div className="form-group">
                            <label for="inpt_bobotkegiatanscheduling">Bobot Kegiatan (Bobot Pekerjann/Durasi)</label>
                            <input type="number" className="form-control" id="inpt_bobotkegiatanscheduling" />
                        </div>
                        <button type="submit" className="btn btn-primary">New Form</button>
                        <button type="submit" className="btn btn-primary">Simpan</button>
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

export default Scheduling