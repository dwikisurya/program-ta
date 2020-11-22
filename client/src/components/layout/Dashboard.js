import React, { useEffect } from 'react'
import Navbar from './Navbar'


const Dashboard = () => {

    useEffect(() => {
        console.log('aaaaa')
    }, [])

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-4">
                            <p> Log</p>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product</th>
                                        <th>Payment Taken</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>TB - Monthly</td>
                                        <td>01/04/2012</td>
                                        <td>Default</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>TB - Monthly</td>
                                        <td>01/04/2012</td>
                                        <td>Default</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>TB - Monthly</td>
                                        <td>01/04/2012</td>
                                        <td>Default</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>TB - Monthly</td>
                                        <td>01/04/2012</td>
                                        <td>Default</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>TB - Monthly</td>
                                        <td>01/04/2012</td>
                                        <td>Default</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>TB - Monthly</td>
                                        <td>01/04/2012</td>
                                        <td>Default</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>TB - Monthly</td>
                                        <td>01/04/2012</td>
                                        <td>Default</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                        <div className="col-md-4">
                            <div className="card">
                                <h5 className="card-header"> Proyek Berjalan </h5>
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Product</th>
                                                <th>Payment Taken</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>TB - Monthly</td>
                                                <td>01/04/2012</td>
                                                <td>Default</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card">
                                <h5 className="card-header">Lokasi/Kota Proyek</h5>
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Product</th>
                                                <th>Payment Taken</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>TB - Monthly</td>
                                                <td>01/04/2012</td>
                                                <td>Default</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card bg-default">
                                <h5 className="card-header">Proyek Selesai</h5>
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Product</th>
                                                <th>Payment Taken</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>TB - Monthly</td>
                                                <td>01/04/2012</td>
                                                <td>Default</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card">
                                <h5 className="card-header">Pekerjaan Paling Banyak Dilakukan</h5>
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Product</th>
                                                <th>Payment Taken</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>TB - Monthly</td>
                                                <td>01/04/2012</td>
                                                <td>Default</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dashboard