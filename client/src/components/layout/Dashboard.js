import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import _ from 'lodash'
import MaterialTable from 'material-table'
import dateFormat from 'dateformat'
import Swal from 'sweetalert2'

import hitpelaporan from '../client/proyek/perkembangan.get'
import hitproyek from '../client/proyek/proyek.get'
import hitrab from '../client/proyek/rab.get'
import hitpelaporantrouble from '../client/proyek/pelaporantrouble.get'
import postpelaporantrouble from '../client/proyek/pelaporantrouble.post'

import { HorizontalBar, Bar } from 'react-chartjs-2'


const Dashboard = () => {
    const role = localStorage.getItem('role') || null
    const namaUser = localStorage.getItem('namaUser') || null

    const [pelaporan, setPelaporan] = useState([])
    const getPelaporan = async () => {
        const pelaporanHit = await hitpelaporan()
        if (pelaporanHit.status = 200) {
            setPelaporan(pelaporanHit.data)
        } else {
            console.log('Error')
        }
    }

    const [proyek, setProyek] = useState([])

    const getProyek = async () => {
        const proyekhit = await hitproyek()
        if (proyekhit.status === 200) {
            setProyek(proyekhit.data)
        } else {
            console.log(proyekhit)
        }
    }

    // Get Pelaporan, untuk chart Proyek Berjalan
    const g1 = _.groupBy(pelaporan, function (value) {
        return value._id + '*' + value.idSchedulingProyek._id;
    });
    const log = _.map(g1, function (group) {
        return {
            id: group[0]._id,
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            uraian: group[0].uraian,
            created_at: dateFormat(group[0].created_at, "dd mmm yyyy HH:MM"),
            status: group[0].status,
            keterangan: group[0].keterangan
        }
    });

    const groupPelaporan = _.groupBy(pelaporan, function (value) {
        return value.idSchedulingProyek.idRabProyek.idProyek.namaProyek;
    });

    const resultPelaporan = _.map(groupPelaporan, function (group) {
        return {
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            total: _.sumBy(group, x => x.persentase).toFixed(2),
            created_at: dateFormat(group[0].created_at, "yyyy"),
            date: group[0].created_at
        }
    });

    const groupPerYear = _.groupBy(resultPelaporan, function (value) {
        return value.created_at + '#' + value.namaProyek
    });

    const resultPerYear = _.map(groupPerYear, function (group) {
        return {
            namaProyek: group[0].namaProyek,
            total: group[0].total,
            tahun: group[0].created_at,
            date: group[0].date
        }
    });

    const dataProyekBerjalan = {
        labels: resultPelaporan.map(m => m.namaProyek),
        datasets: [
            {
                label: "label",
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
                            stepSize: 1
                        },
                    },
                ],
            },
        }
    }

    // Get Proyek untuk Lokasi / Kota Proyek Chart

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
                            stepSize: 1
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
            if (d1.status != "RAB Accepted" && d1.status != "Proyek Selesai" && d1.status != "Proyek Cancel") {
                return (
                    <tr key={d1.id}>
                        <td>{d1.namaProyek}</td>
                        <td>{d1.status}</td>
                    </tr>
                )
            }
        })
    }

    const [pelaporanTrouble, setPelaporanTrouble] = useState([])
    const getPelaporanTrouble = async () => {
        const pelaporantrouble = await hitpelaporantrouble()
        if (pelaporantrouble.status = 200) {
            setPelaporanTrouble(pelaporantrouble.data)
        } else {
            console.log('Error')
        }
    }

    // Pelaporan Trouble
    const revisiTrouble = (e, id, namaproyek) => {
        if (role === "pm") {
            Swal.fire({
                title: 'Harap isi keterangan',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                showLoaderOnConfirm: true,
                preConfirm: (statusQ) => {
                    pelaporanTrouble.map(ptrouble => {
                        if (id != ptrouble.idPelaporan)
                            postpelaporantrouble(id, namaproyek, statusQ, namaUser)
                    })
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Berhasil disimpan',
                    })
                }
            })
        } else {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: 'error',
                title: `Tidak bisa melakukan aksi karena role bukan semestinya.`
            })
        }
    }

    useEffect(() => {
        getPelaporan()
        getProyek()
        getRAB()
        getPelaporanTrouble()
    }, [])

    return (
        <div className="container-fluid">
            <Navbar />
            {
                (
                    role === "direktur" ||
                    role === "pm")
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
                                        { title: "Status", field: "status" },
                                        { title: "Keterangan", field: "keterangan" },
                                    ]}
                                    data={(log)}
                                    actions={[
                                        rowData => ({
                                            icon: 'error',
                                            tooltip: 'Solve Trouble',
                                            disabled: rowData.status != "Trouble",
                                            onClick: (e, rowData) => revisiTrouble(e, rowData.id, rowData.namaProyek),
                                        })
                                    ]}
                                    options={{
                                        grouping: true,
                                        paging: true,
                                        pageSize: 5,
                                        search: false,
                                        actionsColumnIndex: -1
                                    }}
                                />

                                <MaterialTable
                                    title="Log Penyelesaian Trouble"
                                    columns={[
                                        { title: "ID", field: "id", hidden: true },
                                        { title: "Id Pelaporan", field: "idPelaporan" },
                                        { title: "Nama Proyek", field: "namaProyek", defaultGroupOrder: 1 },
                                        { title: "Uraian", field: "uraian" },
                                        { title: "Date", field: "created_at", defaultSort: 'desc' },
                                        { title: "Posted", field: "posted_by" },
                                    ]}
                                    data={(pelaporanTrouble)}
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
                                            search: false,

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