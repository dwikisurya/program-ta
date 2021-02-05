import React, { useState, useEffect, Fragment } from 'react'
import Navbar from '../Navbar'
import ModalRAB from './ModalRAB'
import _ from 'lodash'
import dateFormat from 'dateformat'
import MaterialTable from "material-table"
import Swal from 'sweetalert2'

import hitpelaporan from '../../client/proyek/perkembangan.get'
import hitscheduling from '../../client/proyek/scheduling.get'
import hitproyek from '../../client/proyek/proyek.get'
import hitpelaporantrouble from '../../client/proyek/pelaporantrouble.get'

const MonitoringProyek = () => {
    const namaUser = localStorage.getItem('namaUser') || null
    const role = localStorage.getItem('role') || null
    // Pelaporan Trouble
    const [pelaporanTrouble, setPelaporanTrouble] = useState([])
    const getPelaporanTrouble = async () => {
        const pelaporantrouble = await hitpelaporantrouble()
        if (pelaporantrouble.status = 200) {
            setPelaporanTrouble(pelaporantrouble.data)
        } else {
            console.log('Error')
        }
    }
    const groupsTrouble = _.groupBy(pelaporanTrouble, function (value) {
        return value._id + '#' + value.namaProyek;
    });

    const dataTrouble = _.map(groupsTrouble, function (group) {
        return {
            namaProyek: group[0].namaProyek,
            idPelaporan: group[0].idPelaporan,
            uraian: group[0].uraian,
            date: dateFormat(group[0].created_at, "dd mmm yyyy HH:MM"),
            posted_by: group[0].posted_by
        }
    });

    // Get Scheduling
    const [scheduling, setScheduling] = useState([])
    const getScheduling = async () => {
        const schedulingHit = await hitscheduling()
        if (schedulingHit.status = 200) {
            setScheduling(schedulingHit.data)
        } else {
            console.log('Error')
        }
    }
    const groupsSCH = _.groupBy(scheduling, function (value) {
        return value._id + '#' + value.idRabProyek.idProyek.namaProyek;
    });

    const mapSCH = _.map(groupsSCH, function (group) {
        return {
            id: group[0]._id,
            namaProyek: group[0].idRabProyek.idProyek.namaProyek,
            sch: group[0].sch,
            created_at: dateFormat(group[0].created_at, "dd mmmm yyyy")
        }
    });

    const dataSch = _.flatMap(mapSCH, ({ id, namaProyek, sch, created_at }) =>
        _.flatMap(sch, ({ uraianPekerjaan, tglKerja, bobotKegiatan, bobotPekerjaan, perkiraanDurasi, created_at }) => ({ id: id, namaProyek: namaProyek, uraian: uraianPekerjaan[0], tglKerja: tglKerja, bobotKegiatan: bobotKegiatan, bobotPekerjaan: bobotPekerjaan, perkiraanDurasi: perkiraanDurasi, created_at: created_at }))
    )

    const laporanSch = _.map(dataSch, function (group) {
        return {
            id: group.id,
            namaProyek: group.namaProyek,
            uraian: group.uraian,
            tglKerja: dateFormat(group.tglKerja, "yyyy-mm-dd"),
            bobotKegiatan: group.bobotKegiatan,
            bobotPekerjaan: group.bobotPekerjaan,
            perkiraanDurasi: group.perkiraanDurasi,
        }
    });

    // Get Pelaporan
    const [pelaporan, setPelaporan] = useState([])
    const getPelaporan = async () => {
        const pelaporanHit = await hitpelaporan()
        if (pelaporanHit.status = 200) {
            setPelaporan(pelaporanHit.data)
        } else {
            console.log('Error')
        }
    }
    const groupsPelaporan = _.groupBy(pelaporan, function (value) {
        return value._id + '#' + value.idSchedulingProyek._id + '#' + value.uraian;
    });

    const laporanPelaporan = _.map(groupsPelaporan, function (group) {
        return {
            id: group[0]._id,
            idSchedulingProyek: group[0].idSchedulingProyek,
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            uraian: group[0].uraian,
            persentase: group[0].persentase,
            total: _.sumBy(group, x => x.persentase),
            idSDB: group[0].idSDB,
            idSDM: group[0].idSDM,
            tgl: dateFormat(group[0].created_at, "yyyy-mm-dd"),
            status: group[0].status,
            keterangan: group[0].keterangan
        }
    });

    const [proyek, setProyek] = useState([])
    const getProyek = async () => {
        const proyekHit = await hitproyek()
        if (proyekHit.status = 200) {
            setProyek(proyekHit.data)
        } else {
            console.log('Error')
        }
    }

    const [formData, setFormData] = useState([])
    const handlerChange = (e) => {
        e.preventDefault();
        setFormData(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    const groupPelaporan = _.groupBy(pelaporan, function (value) {
        return value.idSchedulingProyek.idRabProyek.idProyek.namaProyek;
    });

    const resultPelaporan = _.map(groupPelaporan, function (group) {
        return {
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            total: _.sumBy(group, x => x.persentase).toFixed(1),
            created_at: dateFormat(group[0].created_at, "yyyy")
        }
    });

    const groupPerYear = _.groupBy(resultPelaporan, function (value) {
        return value.created_at + '#' + value.namaProyek
    });

    const resultPerYear = _.map(groupPerYear, function (group) {
        return {
            namaProyek: group[0].namaProyek,
            total: group[0].total,
            tahun: group[0].created_at
        }
    });


    const renderProyekq = () => {
        return proyek.map(proyekq => {
            return resultPerYear.map(r1 => {
                if (proyekq.namaProyek === r1.namaProyek) {
                    return (
                        <option key={proyekq._id} value={proyekq.namaProyek} name={proyekq.namaProyek}>{proyekq.namaProyek}</option>
                    )
                }
            })
        })
    }

    // Ambil Scheduling / tanggal
    const arr = []
    laporanSch.map(ls => {
        for (let a = 0; a < ls.perkiraanDurasi; a++) {
            const date = new Date(ls.tglKerja);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            arr.push({ namaProyek: ls.namaProyek, uraian: ls.uraian, tgl: new Date(year, month, day + a), bobot: ls.bobotPekerjaan })
        }
    })

    const resultSch = _.map(arr, function (group) {
        return {
            namaProyek: group.namaProyek,
            uraian: group.uraian,
            tgl: dateFormat(group.tgl, "yyyy-mm-dd"),
            bobot: group.bobot
        }
    });

    const hitungHariqqq = _.map(arr, function (group) {
        return {
            namaProyek: group.namaProyek,
            uraian: group.uraian,
            tgl: dateFormat(group.tgl, "yyyy-mm-dd"),
            bobot: group.bobot
        }
    });

    const aa = () => {
        let asd = 0
        let b = 0
        return laporanPelaporan.map(lp => {
            console.log(lp)
            if (lp.namaProyek === formData.namaProyek) {
                b += lp.persentase
                return (
                    <tr>
                        <td>{lp.uraian}</td>
                        <td>{lp.tgl}</td>
                        <td>{b.toFixed(0)}</td>
                        {resultSch.map(rs => {
                            if (rs.namaProyek === lp.namaProyek && lp.tgl === rs.tgl) {
                                asd += rs.bobot
                                if (asd.toFixed(1) === b.toFixed(1)) {
                                    return <><td>{asd.toFixed(0)}</td><td>{'Tepat Waktu'}</td> <td></td></>
                                } else {
                                    return <><td>{asd.toFixed(0)}</td><td style={{ color: 'red' }}>{'Tidak Sesuai'}</td><td>{lp.keterangan}</td> <td>{pelaporanTrouble.map(pt => {
                                        if (lp.id === pt.idPelaporan) {
                                            return pt.uraian
                                        }
                                    })}</td>
                                    </>
                                }
                            }
                        })}
                    </tr>
                )
            }
        })
    }

    const rendertablePelaporan = () => {
        return laporanPelaporan.map(lp1 => {
            if (lp1.namaProyek === formData.namaProyek) {
                return (
                    <tr key={lp1.id}>
                        <td>{lp1.uraian}</td>
                        <td> {lp1.idSDB.map(nb => {
                            return <tr colSpan={nb.length}>{nb.namaBarang + ','}</tr>
                        })}
                        </td>
                        <td> {lp1.idSDM.map(nm => {
                            return <tr colSpan={nm.length}>{nm.namaKaryawan + ','}</tr>
                        })}
                        </td>
                        <td>{lp1.tgl}</td>
                        <td>{lp1.status}</td>
                        <td>{lp1.keterangan}</td>
                        <td>{lp1.persentase}</td>
                    </tr>
                )
            }
        })
    }

    const renderTablePelaporanTrouble = () => {
        return dataTrouble.map(dt1 => {
            if (dt1.namaProyek === formData.namaProyek) {
                return (
                    <tr key={dt1.id}>
                        <td>{dt1.idPelaporan}</td>
                        <td>{dt1.uraian}</td>
                        <td>{dt1.date}</td>
                        <td>{dt1.posted_by}</td>
                    </tr>
                )
            }
        })
    }

    let hasilHitungYear = 0
    resultPerYear.map(p1 => {
        if (p1.namaProyek === formData.namaProyek) {
            return hasilHitungYear = p1.total
        }
    })
    // Date Picker
    const [formDate, setFormDate] = useState([])
    const handlerChangeDate = (e) => {
        setFormDate(formdate => ({ ...formdate, [e.target.name]: e.target.value }))
    }
    const date1 = new Date(formDate.tglKerja);
    const aaa = resultSch.filter(({ namaProyek }) => namaProyek === formData.namaProyek)
        .reduce(function (previousValue, currentValue) {
            return previousValue.tgl < currentValue.tgl ? previousValue : currentValue;
        }, 0);
    const date2 = new Date(aaa.tgl)
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let hasilHitung = 0
    const hitungHari = (x) => {
        const y = x + 1
        const hariq = hitungHariqqq.filter(a => a.namaProyek === formData.namaProyek)
        const a = hariq.slice(0, y).reduce(function (accumulator, b) {
            return accumulator + b.bobot;
        }, 0)
        return hasilHitung = a.toFixed(1)
    }
    hitungHari(diffDays)

    useEffect(() => {
        getScheduling()
        getPelaporan()
        getProyek()
        getPelaporanTrouble()
    }, [])

    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="row clearfix" style={{ margin: 10 }}>

                    <div className="col-md-6">
                        <label><h4>Pilih Proyek</h4></label>
                        <select className="form-control" name="namaProyek" onChange={handlerChange.bind(this)}>
                            <option>     </option>
                            {renderProyekq()}
                        </select><button type="button" className="btn btn-warning" onClick={() => window.location = "/monitoringproyek"}>Clear</button>
                    </div>
                    <br /><br />

                    <div className="col-md-12">
                    </div>

                    <div className="col-md-8" style={{ marginTop: 20 }}>
                        <h5>Monitoring Realitas</h5>
                        <table className="table table-bordered" id="Scheduling">
                            <thead>
                                <tr>
                                    <th>Uraian</th>
                                    <th>Tanggal Kerja</th>
                                    <th>Realitas</th>
                                    <th>Persentase Scheduling</th>
                                    <th>Status</th>
                                    <th>Kendala</th>
                                    <th>Penyelesaian PM</th>
                                </tr>
                            </thead>
                            <tbody>{aa()}</tbody>
                        </table>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default MonitoringProyek