import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import _ from 'lodash'
import MaterialTable from 'material-table'
import dateFormat from 'dateformat'

import hitpelaporan from '../client/proyek/perkembangan.get'
import hitproyek from '../client/proyek/proyek.get'
import hitrab from '../client/proyek/rab.get'

import { HorizontalBar, Bar } from 'react-chartjs-2'


const Dashboard = () => {
    const role = localStorage.getItem('role') || null
    // Get Pelaporan, untuk chart Proyek Berjalan
    const [pelaporan, setPelaporan] = useState([])
    const getPelaporan = async () => {
        const pelaporanHit = await hitpelaporan()
        if (pelaporanHit.status = 200) {
            setPelaporan(pelaporanHit.data)
        } else {
            console.log('Error')
        }
    }
    const g1 = _.groupBy(pelaporan, function (value) {
        return value._id + '*' + value.idSchedulingProyek._id;
    });
    const log = _.map(g1, function (group) {
        return {
            id: group[0]._id,
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            uraian: group[0].uraian,
            created_at: dateFormat(group[0].created_at, "dd mmm yyyy HH:MM")
        }
    });

    const groupPelaporan = _.groupBy(pelaporan, function (value) {
        return value.idSchedulingProyek.idRabProyek.idProyek.namaProyek;
    });

    const resultPelaporan = _.map(groupPelaporan, function (group) {
        return {
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            total: _.sumBy(group, x => x.persentase).toFixed(2), //returns object
            created_at: dateFormat(group[0].created_at, "yyyy")
        }
    });

    const groupPerYear = _.groupBy(resultPelaporan, function (value) {
        return value.created_at
    });

    const resultPerYear = _.map(groupPerYear, function (group) {
        return {
            namaProyek: group[0].namaProyek,
            total: group[0].total,
            tahun: group[0].created_at
        }
    });


    const dataProyekBerjalan = {
        labels: resultPelaporan.map(m => m.namaProyek),
        datasets: [
            {
                label: '% Pekerjaan',
                data: resultPelaporan.map(m => m.total),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        }
    }

    // Get Proyek untuk Lokasi / Kota Proyek Chart
    const [proyek, setProyek] = useState([])

    const getProyek = async () => {
        const proyekhit = await hitproyek()
        if (proyekhit.status === 200) {
            setProyek(proyekhit.data)
        } else {
            console.log(proyekhit)
        }
    }

    const groupProyekTotal = _.groupBy(proyek, function (value) {
        return value.kategoriProyek.namaKategori + '*' + value.lokasiProyek;
    });

    const resultProyekTotal = _.map(groupProyekTotal, function (group) {
        return {
            proyek: group[0].kategoriProyek.namaKategori,
            totalCount: _.countBy(group, Math.floor),
        }
    });

    const groupProyekLokasi = _.groupBy(proyek, function (value) {
        return value.lokasiProyek;
    });

    const resultProyekLokasi = _.map(groupProyekLokasi, function (group) {
        return {
            lokasi: group[0].lokasiProyek,
            totalCount: _.countBy(group, Math.floor),
        }
    });

    const dataTotalProyek = {
        labels: resultProyekTotal.map(m => m.proyek),
        datasets: [
            {
                label: 'Jenis',
                data: resultProyekTotal.map(m => m.totalCount[NaN]),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        }
    }

    const dataLokasiProyek = {
        labels: resultProyekLokasi.map(m => m.lokasi),
        datasets: [
            {
                label: resultProyekLokasi.map(m => m.lokasi),
                data: resultProyekLokasi.map(m => m.totalCount[NaN]),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }

    let options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    },
                },
            ],
        },
    }



    //
    // Get
    const [rab, setRab] = useState([])
    const getRAB = async () => {
        const rabhit = await hitrab()
        if (rabhit.status = 200) {
            setRab(rabhit.data)
        } else {
            console.log('Error')
        }
    }

    // To show data to datatable
    const groupsProyekBelumAcc = _.groupBy(proyek, function (value) {
        return value._id + '#' + value.namaProyek;
    });


    const dataProyekBelumAcc = _.map(groupsProyekBelumAcc, function (group) {
        return {
            id: group[0]._id,
            namaProyek: group[0].namaProyek,
            status: group[0].statusProyek
        }
    });

    const rendertable = () => {
        return dataProyekBelumAcc.map(d1 => {
            if (d1.status != "RAB Accepted") {
                return (
                    <tr key={d1.id}>
                        <td>{d1.namaProyek}</td>
                        <td>{d1.status}</td>
                    </tr>
                )
            }
        })
    }

    useEffect(() => {
        getPelaporan()
        getProyek()
        getRAB()
    }, [])

    return (
        <div className="container-fluid">
            <Navbar />
            {
                (
                    role === "direktur")
                &&
                <div className="row" style={{ margin: 10 }}>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-4">
                                <MaterialTable
                                    title="Log"
                                    columns={[
                                        { title: "ID", field: "id", hidden: true },
                                        { title: "Nama Proyek", field: "namaProyek", defaultGroupOrder: 1 },
                                        { title: "Uraian", field: "uraian" },
                                        { title: "Date", field: "created_at", defaultSort: 'desc' },
                                    ]}
                                    data={(log)}
                                    options={{
                                        grouping: true,
                                        paging: true,
                                        pageSize: 5,
                                        search: false
                                    }}
                                />
                            </div>


                            <div className="col-md-4">

                                <div className="card">
                                    <h5 className="card-header"> Proyek Berjalan </h5>
                                    <div className="card-body">
                                        <HorizontalBar data={dataProyekBerjalan} options={options} />
                                    </div>
                                </div>
                                <div className="card" style={{ marginTop: 20 }}>
                                    <h5 className="card-header"> Proyek Belum Berjalan </h5>
                                    <div className="card-body">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Nama Proyek</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rendertable()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>

                            <div className="col-md-4">
                                <div className="card bg-default">
                                    <h5 className="card-header">Lokasi</h5>
                                    <div className="card-body">
                                        <Bar data={dataLokasiProyek} options={options} />
                                    </div>
                                </div>


                                <div className="card-body">
                                    <MaterialTable
                                        title="Penyelesaian Proyek/ Tahun"
                                        columns={[
                                            { title: "Tahun", field: "tahun", defaultGroupOrder: 1, defaultSort: 'desc' },
                                            { title: "Nama Proyek", field: "namaProyek" },
                                            { title: "Persentase", field: "total" },
                                        ]}
                                        data={(resultPerYear)}
                                        options={{
                                            grouping: true,
                                            paging: true,
                                            pageSize: 5,
                                            search: false
                                        }}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            }

        </div >
    )
}

export default Dashboard