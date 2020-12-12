import { React, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import dateFormat from 'dateformat'
import _ from 'lodash'
import MaterialTable from "material-table"

import hitpelaporan from '../../client/proyek/perkembangan.get'

const LaporanSumberDaya = () => {

    // Get Data Pelaporan
    const [pelaporan, setPelaporan] = useState([])
    const getData = async () => {
        const pelaporanHit = await hitpelaporan()
        if (pelaporanHit.status = 200) {
            setPelaporan(pelaporanHit.data)
        } else {
            console.log('Error')
        }
    }

    // Ambil Data GroupBy idscheduling dan uraiannya ap
    var groups1 = _.groupBy(pelaporan, function (value) {
        return value._id
    });

    var result = _.map(groups1, function (group) {
        return {
            idSchedulingProyek: group[0].idSchedulingProyek,
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            idSDB: group[0].idSDB,
            idSDM: group[0].idSDM,
        }
    });

    const dataSDM = _.flatMap(result, ({ idSchedulingProyek, namaProyek, idSDB, idSDM }) =>
        _.flatMap(idSDM, ({ namaKaryawan }) => ({ idSchedulingProyek: idSchedulingProyek, namaProyek: namaProyek, namaKaryawan: namaKaryawan, idSDM: idSDM }))
    )
    var groupSDM = _.groupBy(dataSDM, function (value) {
        return value.namaKaryawan + '#' + value.namaProyek
    });
    var laporanSDM = _.map(groupSDM, function (group) {
        return {
            namaProyek: group[0].namaProyek,
            namaKaryawan: group[0].namaKaryawan,
            totalCount: _.countBy(group, Math.floor())
        }
    });


    const dataSDB = _.flatMap(result, ({ idSchedulingProyek, namaProyek, idSDM, idSDB }) =>
        _.flatMap(idSDB, ({ namaBarang }) => ({ idSchedulingProyek: idSchedulingProyek, namaProyek: namaProyek, idSDM: idSDM, namaBarang: namaBarang }))
    )
    var groupSDB = _.groupBy(dataSDB, function (value) {
        return value.namaBarang + '#' + value.namaProyek
    });
    var laporanSDB = _.map(groupSDB, function (group) {
        return {
            namaProyek: group[0].namaProyek,
            namaBarang: group[0].namaBarang,
            totalCount: _.countBy(group, Math.floor())
        }
    });

    console.log({ laporanSDM })


    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row" style={{ margin: 10 }}>
                <div className="col-md-6">
                    <MaterialTable
                        title="Laporan Bekerja Sumber Daya Manusia"
                        columns={[
                            { title: "Nama Karyawan", field: "namaKaryawan", defaultGroupOrder: 0 },
                            { title: "Nama Proyek", field: "namaProyek" },
                            { title: "Total Count", field: "totalCount.undefined" },
                        ]}
                        data={(laporanSDM)}
                        options={{
                            grouping: true,
                            exportButton: true,
                            exportAllData: true,
                        }}
                    />
                </div>


                <div className="col-md-6">
                    <MaterialTable
                        title="Laporan Digunakan Sumber Daya Barang"
                        columns={[
                            { title: "Nama Proyek", field: "namaProyek" },
                            { title: "Nama Barang", field: "namaBarang", defaultGroupOrder: 0 },
                            { title: "Total Count", field: "totalCount.undefined" },
                        ]}
                        data={(laporanSDB)}
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

export default LaporanSumberDaya