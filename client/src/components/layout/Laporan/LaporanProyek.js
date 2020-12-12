import { React, useState, useEffect } from 'react'
import Navbar from '../Navbar'
import dateFormat from 'dateformat'
import _ from 'lodash'
import MaterialTable from "material-table"

import hitrab from '../../client/proyek/rab.get'
import hitscheduling from '../../client/proyek/scheduling.get'
import hitpelaporan from '../../client/proyek/perkembangan.get'

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

    var groupsRAB = _.groupBy(rab, function (value) {
        return value._id + '#' + value.idProyek.namaProyek;
    });

    var dataRAB = _.map(groupsRAB, function (group) {
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

    var groupsRABQ = _.groupBy(huwalaRABA, function (value) {
        return value.id + '#' + value.namaProyek + '#' + value.uraian
    });
    console.log({ groupsRABQ })
    var dataRABQ = _.map(groupsRABQ, function (group) {
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

    var groupsRABQQ = _.groupBy(huwalaRABA, function (value) {
        return value.id + '#' + value.namaProyek + '#' + value.uraian
    });

    var dataRABQQ = _.map(groupsRABQQ, function (group) {
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

    const huwalaRABAA = _.flatMap(dataRABQQ, ({ id, namaProyek, uraian, idKegiatanProyek, volume }) =>
        _.flatMap(idKegiatanProyek, ({ namaKegiatan }) => ({ id: id, namaProyek: namaProyek, uraian: uraian, namaKegiatan: namaKegiatan, volume: volume }))
    )

    const huwalaRABAB = _.flatMap(dataRABQQ, ({ id, namaProyek, uraian, volume }) =>
        _.flatMap(volume, ({ volume }) => ({ id: id, namaProyek: namaProyek, uraian: uraian, volume: volume }))
    )


    var merge = _.unionBy(huwalaRABAA, huwalaRABAB);
    var merge2 = _.map(huwalaRABA, function (item) {
        return _.merge(item, _.find(huwalaRABAB, { namaKegiatan: item.namaKegiatan, 'volume': item.volume }));
    });


    // Map Volume
    // const laporanRABC = _.flatMap(huwalaRAB, ({ id, namaProyek, uraian, status, totalHarga, volume }) =>
    //     _.map(volume, tag => ({ id, namaProyek, uraian, status, totalHarga, ...tag }))
    // );

    // const a = _.merge(laporanRABA, laporanRABB)
    // const b = _.defaultsDeep(laporanRABA, laporanRABB)


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
    var groupsSCH = _.groupBy(scheduling, function (value) {
        return value._id + '#' + value.idRabProyek.idProyek.namaProyek;
    });

    var mapSCH = _.map(groupsSCH, function (group) {
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

    var laporanSch = _.map(dataSch, function (group) {
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
    var groupsPelaporan = _.groupBy(pelaporan, function (value) {
        return value._id + '#' + value.idSchedulingProyek._id + '#' + value.uraian;
    });

    var laporanPelaporan = _.map(groupsPelaporan, function (group) {
        return {
            id: group[0]._id,
            idSchedulingProyek: group[0].idSchedulingProyek,
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            uraian: group[0].uraian,
            persentase: group[0].persentase,
            total: _.sumBy(group, x => x.persentase).toFixed(2),
            idSDB: group[0].idSDB.map(v => Object.values(v).join('_')).join(','),
            idSDM: group[0].idSDM.map(v => Object.values(v).join('_')).join(','),
        }
    });
    console.log({ laporanSch, laporanPelaporan })

    useEffect(() => {
        getRAB()
        getSCheduling()
        getPelaporan()
    }, [])


    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <MaterialTable
                        title="Laporan RAB"
                        columns={[
                            { title: "Nama Proyek", field: "namaProyek", defaultGroupOrder: 0 },
                            { title: "Uraian", field: "uraian" },
                            {
                                title: "Nama Kegiatan", field: "idKegiatanProyek", render:
                                    (rowData) => {
                                        return <div>
                                            {rowData.idKegiatanProyek.map(v => {
                                                return <p>{v.namaKegiatan}</p>
                                            })}
                                        </div>
                                    }
                            },
                            {
                                title: "Harga Kegiatan", field: "hargaKegiatan", render:
                                    (rowData) => {
                                        return <div>
                                            {rowData.hargaKegiatan.map(v => {
                                                return <p>{v}</p>
                                            })}
                                        </div>
                                    }
                            },
                            {
                                title: "Volume", field: "volume", render:
                                    (rowData) => {
                                        return <div>
                                            {rowData.volume.map(v => {
                                                return <p>{v}</p>
                                            })}
                                        </div>
                                    }
                            },
                            { title: "Total Harga", field: "totalHarga" },
                        ]}
                        data={(dataRABQ)}
                        options={{
                            grouping: true,
                            exportButton: true,
                            exportAllData: true,
                        }}
                    />
                    <br /><br />
                    <MaterialTable
                        title="Laporan Scheduling"
                        columns={[
                            { title: "Nama Proyek", field: "namaProyek", defaultGroupOrder: 0 },
                            { title: "Uraian", field: "uraian" },
                            { title: "Bobot Kegiatan", field: "bobotKegiatan" },
                            { title: "Bobot Pekerjaan", field: "bobotPekerjaan" },
                            { title: "Tanggal Kerja", field: "tglKerja" },
                            { title: "Durasi", field: "perkiraanDurasi" },
                            { title: "Perkiraan Berakhir", field: "perkiraanBerakhir" },
                        ]}
                        data={(laporanSch)}
                        options={{
                            grouping: true,
                            exportButton: true,
                            exportAllData: true,
                        }}
                    />
                </div>



                <div className="col-md-6">
                    <MaterialTable
                        title="Laporan Pelaporan"
                        columns={[
                            { title: "Nama Proyek", field: "namaProyek", defaultGroupOrder: 0 },
                            { title: "Uraian", field: "uraian" },
                            { title: "SD Barang Digunakan", field: "idSDB" },
                            { title: "SD Manusia Bekerja", field: "idSDM" },
                            { title: "Persentase", field: "persentase" },
                        ]}
                        data={(laporanPelaporan)}
                        options={{
                            grouping: true,
                            exportButton: true,
                            exportAllData: true,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default LaporanProyek