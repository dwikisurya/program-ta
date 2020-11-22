import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import hitsdb from '../../client/sumberdaya/sdbarang.get'
import postsdb from '../../client/sumberdaya/sdbarang.post'

const SDB = () => {

    const [sdbData, setsdbData] = useState([])

    useEffect(() => {

        const getData = async () => {
            const sdb = await hitsdb()
            if (sdb.status === 200) {
                setsdbData(sdb.data)
            } else {
                console.log(sdb)
            }
        }
        getData()
    }, [])

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form role="form">
                        <div className="form-group">
                            <h5>Input Data SDB</h5>
                            <label for="inp_namabarang">Nama Barang</label>
                            <input type="text" className="form-control" id="inp_namabarang" />
                        </div>
                        <div className="form-group">
                            <label for="inp_satuan">Satuan</label>
                            <input type="text" className="form-control" id="inp_satuan" />
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

export default SDB