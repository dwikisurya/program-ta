import { React, useState, useEffect } from 'react'
import Navbar from '../Navbar'
import dateFormat from 'dateformat'
import _, { fromPairs } from 'lodash'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";


import hitrab from '../../client/proyek/rab.get'
import hitscheduling from '../../client/proyek/scheduling.get'
import hitpelaporan from '../../client/proyek/perkembangan.get'
import hitproyek from '../../client/proyek/proyek.get'

const LaporanProyek = () => {
    // RAB
    const [rab, setRab] = useState([])
    const getRAB = async () => {
        const rabhit = await hitrab()
        if (rabhit.status = 200) {
            setRab(rabhit.data)
        } else {
            console.log('Error')
        }
    }

    const groupsRAB = _.groupBy(rab, function (value) {
        return value._id + '#' + value.idProyek.namaProyek;
    });

    const dataRAB = _.map(groupsRAB, function (group) {
        return {
            id: group[0]._id,
            namaProyek: group[0].idProyek.namaProyek,
            rab: group[0].rab,
            status: group[0].status,
        }
    });

    // Map IdKegiatanProyek
    const huwalaRABA = _.flatMap(dataRAB, ({ id, namaProyek, rab, status }) =>
        _.flatMap(rab, ({ uraianPekerjaan, idKegiatanProyek, totalHarga, volume, hargaKegiatan }) => ({ id: id, namaProyek: namaProyek, uraian: uraianPekerjaan, idKegiatanProyek: idKegiatanProyek, status: status, totalHarga: totalHarga, volume: volume, hargaKegiatan: hargaKegiatan }))
    )

    const groupsRABQ = _.groupBy(huwalaRABA, function (value) {
        return value.id + '#' + value.namaProyek + '#' + value.uraian
    });

    const groupsRABQQ = _.groupBy(huwalaRABA, function (value) {
        return value.namaProyek + '#' + value.uraian
    });

    const dataRABQQ = _.map(groupsRABQQ, function (group) {
        return {
            id: group[0].id,
            namaProyek: group[0].namaProyek,
            idKegiatanProyek: group[0].idKegiatanProyek,
            uraian: group[0].uraian,
            hargaKegiatan: group[0].hargaKegiatan,
            volume: group[0].volume,
            totalHarga: group[0].totalHarga
        }
    });
    console.log(dataRABQQ)


    // Scheduling
    const [scheduling, setScheduling] = useState([])
    const getSCheduling = async () => {
        const schHit = await hitscheduling()
        if (schHit.status = 200) {
            setScheduling(schHit.data)
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
            tglKerja: dateFormat(group.tglKerja, "dd mmmm yyyy"),
            bobotKegiatan: group.bobotKegiatan,
            bobotPekerjaan: group.bobotPekerjaan,
            perkiraanDurasi: group.perkiraanDurasi + ' hari',
            perkiraanBerakhir: dateFormat(parseInt(dateFormat(group.tglKerja, 'dd')) + group.perkiraanDurasi + dateFormat(group.tglKerja, " mmmm yyyy"), 'dd mmmm yyyy')
        }
    });

    const rendertableSch = () => {
        return laporanSch.map(schq => {
            if (schq.namaProyek === formData.namaProyek) {
                return (
                    <tr key={schq.id}>
                        <td>{schq.uraian}</td>
                        <td>{schq.perkiraanDurasi}</td>
                        <td>{schq.tglKerja}</td>
                        <td>{schq.perkiraanBerakhir}</td>
                    </tr>
                )
            }
        })
    }

    // Pelaporan
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
            total: _.sumBy(group, x => x.persentase).toFixed(2),
            idSDB: group[0].idSDB,
            idSDM: group[0].idSDM,
        }
    });

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

                    </tr>
                )
            }
        })
    }
    const rendertableRAB = () => {
        return dataRABQQ.map(rabq => {
            if (rabq.namaProyek === formData.namaProyek) {
                return (
                    <tr key={rabq.id}>
                        <td width="50px">{rabq.uraian}</td>
                        <td> {rabq.idKegiatanProyek.map(nm => {
                            return <tr><td style={{ height: 100 }}>{nm.namaKegiatan}<br></br></td></tr>
                        })}
                        </td>
                        <td> {rabq.volume.map(nb => {
                            return <tr><td style={{ height: 100 }}>{nb}<br></br></td></tr>
                        })}
                        </td>
                        <td> {rabq.hargaKegiatan.map(nb => {
                            return <tr><td style={{ height: 100 }}>{nb}<br></br></td></tr>
                        })}
                        </td>
                        <td>{rabq.totalHarga} </td>
                    </tr>
                )
            }
        })
    }

    const exportPDFRAB = () => {
        const doc = new jsPDF('landscape')
        var finalY = doc.lastAutoTable.finalY || 10

        doc.text('RAB', 14, finalY + 15)
        doc.autoTable({
            startY: finalY + 20,
            html: '#RAB',
            useCss: true,
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 80 },
                2: { cellWidth: 25 },
                3: { cellWidth: 30 },
                // etc
            }
        })
        doc.save('rab.pdf')
    }
    const exportPDFSCHEDULING = () => {
        const doc = new jsPDF()
        autoTable(doc, {
            html: '#SCheduling'
        })
        doc.save('scheduling.pdf')
    }
    const exportPDFPELAPORAN = () => {
        const doc = new jsPDF()
        autoTable(doc, {
            html: '#Pelaporan'
        })
        doc.save('pelaporan.pdf')
    }

    const [proyek, setProyek] = useState([])
    const [formData, setFormData] = useState([])
    const getProyek = async () => {
        const proyekHit = await hitproyek()
        if (proyekHit.status = 200) {
            setProyek(proyekHit.data)
        } else {
            console.log('Error')
        }
    }
    const renderProyek = () => {
        return proyek.map(proyekq => {
            return (
                <option key={proyekq._id} value={proyekq.namaProyek} name={proyekq.namaProyek}>{proyekq.namaProyek}</option>
            )
        })
    }

    const handlerChange = (e) => {
        e.preventDefault();
        setFormData(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }
    useEffect(() => {
        getRAB()
        getSCheduling()
        getPelaporan()
        getProyek()
    }, [])


    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row" style={{ margin: 10 }}>

                <div className="row" style={{ margin: 10 }}>
                    <div className="col-md-12">
                        <select className="form-control" name="namaProyek" onChange={handlerChange.bind(this)}>
                            <option>     </option>
                            {renderProyek()}
                        </select><button type="button" className="btn btn-warning" onClick={() => window.location = "/laporan/proyek"}>Clear</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <h5>RAB</h5>
                        <table className="table table-bordered" id="RAB">
                            <thead>
                                <tr>
                                    <th width="50px">Uraian Pekerjaan</th>
                                    <th>Data Kegiatan</th>
                                    <th>Volume</th>
                                    <th>Harga Kegiatan</th>
                                    <th>Total Harga</th>
                                </tr>
                            </thead>
                            <tbody>{rendertableRAB()}</tbody>
                        </table>
                        <button type="button" class="btn btn-primary" onClick={() => exportPDFRAB()}>Download</button>
                    </div>

                    <div className="col-md-4">
                        <h5>Scheduling</h5>
                        <table className="table table-bordered" id="Scheduling">
                            <thead>
                                <tr>
                                    <th>Uraian Pekerjaan</th>
                                    <th>Durasi Pekerjaan</th>
                                    <th>Tanggal Kerja</th>
                                    <th>Perkiraan Berakhir</th>
                                </tr>
                            </thead>
                            <tbody>{rendertableSch()}</tbody>
                        </table>
                        <button type="button" class="btn btn-primary" onClick={() => exportPDFSCHEDULING()}>Download</button>
                    </div>

                    <div className="col-md-4">
                        <h5>Perkembangan Proyek</h5>
                        <table className="table table-bordered" id="Pelaporan">
                            <thead>
                                <tr>
                                    <th>Uraian Pekerjaan</th>
                                    <th>SDB Digunakan</th>
                                    <th>SDM Bekerja</th>
                                </tr>
                            </thead>
                            <tbody>{rendertablePelaporan()}</tbody>
                        </table>
                        <button type="button" class="btn btn-primary" onClick={() => exportPDFPELAPORAN()}>Download</button>
                    </div>

                </div>



            </div>
        </div >
    )
}

export default LaporanProyek