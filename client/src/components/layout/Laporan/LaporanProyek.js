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
    console.log(dataSch)
    const laporanSch = _.map(dataSch, function (group) {
        return {
            id: group.id,
            namaProyek: group.namaProyek,
            uraian: group.uraian,
            tglKerja: dateFormat(group.tglKerja, "dd mmmm yyyy"),
            bobotKegiatan: group.bobotKegiatan,
            bobotPekerjaan: group.bobotPekerjaan,
            perkiraanDurasi: group.perkiraanDurasi + ' hari',

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
            tgl: dateFormat(group[0].created_at, "dd mmmm yyyy"),
            status: group[0].status,
            keterangan: group[0].keterangan
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
                        <td>{lp1.tgl}</td>
                        <td>{lp1.status}</td>
                        <td>{lp1.keterangan}</td>
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
    const groupsTeamRAB = _.groupBy(rab, function (value) {
        return value._id + '#' + value.idProyek.namaProyek;
    });
    const dataTeamRAB = _.map(groupsTeamRAB, function (group) {
        return {
            id: group[0]._id,
            namaProyek: group[0].idProyek.namaProyek,
            idSDM: group[0].idSDM,
            workhourSDM: group[0].workhourSDM
        }
    });

    const rendertableTeamRAB = () => {
        return dataTeamRAB.map(dtr => {
            if (dtr.namaProyek === formData.namaProyek) {
                return (
                    <tr key={dtr.id}>
                        <td> {dtr.idSDM.map(nm => {
                            return <tr><td style={{ height: 100 }}>{nm.namaKaryawan}<br></br></td></tr>
                        })}
                        </td>
                        <td> {dtr.workhourSDM.map(nm => {
                            return <tr><td style={{ height: 100 }}>{nm + ' Jam'}<br></br></td></tr>
                        })}
                        </td>
                    </tr>
                )
            }
        })
    }

    const exportPDFRAB = () => {
        var imgData =
            "data:image/jpeg;base64,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"
        const doc = new jsPDF('landscape')
        const finalY = doc.lastAutoTable.finalY || 10
        const namaProyek = `RAB Proyek: ` + formData.namaProyek

        const today = new Date();
        const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        const dateTime = 'Tanggal: ' + date + ' ' + time

        doc.addImage(imgData, "JPEG", 270, 5, 20, 20);
        doc.text('PT.Saba Pratama Surabaya', 14, finalY)
        doc.text(namaProyek, 14, finalY + 15)
        doc.text(dateTime, 215, finalY + 25)

        doc.autoTable({
            startY: finalY + 30,
            html: '#RAB',
            useCss: true,
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 80 },
                2: { cellWidth: 25 },
                3: { cellWidth: 30 },
                // etc
            },

        })
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 1115,
            html: '#TeamRAB',
            useCss: true,
        })
        doc.save('rab.pdf')
    }
    const exportPDFSCHEDULING = () => {
        var imgData =
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAOwA7AAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAA7AAAAAQAAADsAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgBFQDvAwERAAIRAQMRAf/EABwAAQACAgMBAAAAAAAAAAAAAAAGBwQIAgMFAf/EAEsQAAIBAwMCAgQICgcFCQAAAAECAwAEBQYREgchEzEUIkHUFhcjMlZXlJUIFRhRVGFxpNLjJDY3QnSRsTVDgYOzJzM0VXW0wdHT/8QAHAEBAAICAwEAAAAAAAAAAAAAAAYHBAUBAgMI/8QARxEAAgECAgQHCwoFBQEBAQAAAAECAwQFEQYhMUESUWFxgZGhBxMUFRYiU7HB0eEXMkJSVGNykqLSIzST4vAzNWKCsvEkQ//aAAwDAQACEQMRAD8A50AoBQCgFAc4YZrmaO3t4nlllYJHGilmdidgAB3JJ9lEs9SGwius+pOktGItsb1czlJIRIbOxkHC2LBwFmmIKhxtGxRA/ZyrNG4IEnwzRi4vUqlfzI9r6N3Sam7xalQ82n5z7CntUdWtZamuhIt6uJto2cwWuNBgWNWYniX3Mkm2+wMjsQNhv2qa22BYfbQ4KpqXLJJvt9hoKuI3NV58Nrm1eo8P4Y6u+lOX+3S/xVkeK7H0MPyr3Hl4Zcekl1sfDHV30py/26X+Kniux9DD8q9w8MuPSS62Phjq76U5f7dL/FTxXY+hh+Ve4eGXHpJdbHwx1d9Kcv8Abpf4qeK7H0MPyr3Dwy49JLrY+GOrvpTl/t0v8VPFdj6GH5V7h4Zcekl1sfDHV30py/26X+Kniux9DD8q9w8MuPSS62Phjq76U5f7dL/FTxXY+hh+Ve4eGXHpJdbHwx1d9Kcv9ul/ip4rsfQw/KvcPDLj0kutj4Y6u+lOX+3S/wAVPFdj6GH5V7h4Zcekl1sfDHV30py/26X+Kniux9DD8q9w8MuPSS62Phhq76U5f7dL/FXPiux9DD8q9w8MuPSS62epiLjqjnlkkw19qW8jhAaWSGedkjBYKCzA7KNyBufaRXhWtMLtlwq1OnFcqivYelOteVXlCUn0sn2P6V9XXliXO69TExz2RvY3Obe7LDYlYiLZpPDlYrtwk4kEjlxB3rSXGKYBRz4FKMmuKC9bWXabClZ4jU+dNrnkyTYzpylnkYXy/ULVuVsR4LSxwXZsZW7KZUDFpgBvzVX28tmKjuo0lbH7R5qjZwXK0n2Ze0z6eG1l8+vLob95Koo0hjSKPlxRQq8nZzsPzsxJJ/WSSfbUaqT75NzaSzeerUuhbkbaMeCkkTPGdKNXXonOSto8J4HNeOUDwyPIpXdBEFaQdn3DMoQ8WHLcbVEcc02wPR7ON5XXDX0Y+dLmyWx87Rt7DA77EddCm8uN6l8ejMk8XSjSdsbmO5zWUv8Adl9GkjjjteKjflzQ+LyJ3XbZhtsfPcbVZindwim44Xa58Upvd+FbPzMllpoJJ67qr0RXtfuPdh0/pGyuprnHaTx0PjJ4ZjkVrlFXkG9UXDScTuo9Yd9txvsSDAsQ7quk9+5KFZU4vdCKWWvPU3nLt1raSC20Rwu3S4UHJre37Fq7DhJgsDK3I4HGD9S2cY/0FRyemGkM3nK+q9FSS9TRs44Lh0dlCH5U/Ycfg9gP/I8f9mT/AOq6+VmP/bq39Wf7jt4nw77PD8kfcR3qFZYXD6bQW2Kx0VzfTiKMi14yBF2d2RlAAI+TU7nuJTsD3ItnuSVsaxvEql7e3VWdGksspVJOLnLUs4ttNJcJ8jUWQ3TGNjZW8behShGcnnmopNJcqWrN5dGZWNfQ5XQoBQCgFAdl0+LwuKj1NqvJDE4I3XojXhTxJJJAhdkgi3DTOFA3A2VTJHzZA4as2xw+4xGp3u3jm9/Euc8Li5p20eFUeRR+uuuWY1BZS6f0pbyYHD3NtHb3wSUtcZHi5kJmf+6hbj8kmy7Rx8ubLzNj4Vo/b4blUl51Tj4uZe0i15idS682OqPEVhW/NYKAUAoBQCgFAKAUAoD6AWIVQST5AUBYem+iGr8pFZ5HP20uCxt7H48Et1CfGuIefEvFEdiw3DbMxVSUYA7gitHiGkFnYZxz4UuJe1mxtsMr3OvLJcbLQwHTHQWn7O1ePCy3+VilMkt3fyrNEwAHFUg4BVG/InmX39XbjseUNvdKb2682l5i5NvWb23wihR1z85kta9vXx9riXu5msbEubW1MhMUBfbnwTyXlxXfYDfYb+VR2pUnVlwqjbfG9Zs4xjBZRWSOmuh2LDwHSO9eOO/1hcSYuPxGU48IRfHg6hg6sNoAw8QAtybdAfDKsGNe6Wd0jCtGP4Kffa2vzItamvrPXwebJvjS2kiwjRq7xXz/AJkONrbzLf6icYrG4PT2z6ew8FlN4aRtc7tJOxCMjMJHJKFw7chHwVt9uOwAFA4/3TMfx+LouapU39GGrPnettPes8uQsPDtFsPw9qfB4clvlr7NntO5nZySzEk9zVfvW83tJEkkskfKHIoBQH1Rudq4fICpOomZtcxqST0Hw2gsoxaLKn++Kkl33DMpHNmCldgUCHYHevs3QDR16NYHStZ/6kvPnySklq5MkknyplI6QYj4zv51V81eauZe95vpIzU0NKKAUAoD7nM5p3p3p2PWWsovSRc8hhsMJCkuVkUlS7FSGjtUYEPINixBjjPLm8W4wfCKuK1clqgtr9i5TBvb6FnDN65PYv8ANxrFrDXWp9dXdtdajyTTrYwejWcCgLDaw8i3CNB2UFmZifNmZmYkkk2hZ2VCwp96t45L185Ea9xUuZcOo82eBWWeAoBQCgFAKAUAoBQCgJvorpFq7Wlg+cgtksMNGXU5C7cRxzOhQNHAD3nkHix7qgPEMGbiu5GrxHGLXDF/FlnLcltMy1sa12/MWrj3F86b0pobQQ20hhBc3ycl/HWVRZbpgfEXlFF3itt0ZD25yI6brNVfYhpDeX+cc+DHiXtZJrXDKFtryzfGzLrQmxFAezpjSmT1XdyW1i0MMcCF5bmcsIo+xKqSqseTEbAAH2k7KGI0mPaRYdo3beFYjU4Mdy2uT4kv8S3tGdh+G3OJ1e9W0c3v4lzlv6fw2E0hbGHA2pa7cgyZG4Ctc7+HwZY2A+RjblIeK9yH2Z3Crt806Wd1LE9IYu2s13ijyPzpLlerU+JJcueWZZ2EaJ2uHtVa/wDEnyrUuZe31GSzFjux3NVhvzJZs1HygFAKAUAoDHyeVgwWHvsxNP4T28DejkLG7NcEERAJIQHHMqzDv6iudjsRU27nuA+UGP0aNSOdOHnz4so7nyN5R6TRaR4h4uw+c4vKUtS537lr6Ch6+yilBQCgFAcs3m9O9O9Ox6z1nD6StzyGGwwkKS5aVSQWYqQ0dqjAh5BsWIMcZ5c3i2+EYRVxWrktUFtfsXKYN7ews4ZvXJ7Eava01pqLqBqK51Rqi+9JvbnioCoEihiUcUhiRdljjRQFVFACgAAValtbUrOkqNFZRRD61adebnN5tnh1kHkKAUAoBQCgFAKAUAoC8+n3Q+1xuNxuruoUPiXN3JDeWWn5AyiWz+eJbtlZXjSUceEakOyMZCUUxGWH45pL4LJ21nrlvlxPiXG+xcuvLe4fhXfUqtfUty4y0b/JXuSdGu5QVhVkghjRY4bdC7P4cUagJEnJ3IRAFHI7AVX05yqSc5vNveySxioLKKyRjV1ORQE80Z06muJLTOamtlXGui3ENsZdpLtSTsGCnlGh47knizKylOzB1rTTjujWmi9N29o1UuX9HPNR5ZZb/wDjnnveSyzk+BaNVsVl3ytnGlx73zZ+vYWKhWG0t8fbIIrSzTwreFd+Ma7kkAfrJJJ8ySSSSSa+XcXxm/x65d3iFRzm+PYuRLYlyItaysbfD6SpW8VFevn4z5WsMsUAoBQCgFAANzsPbTYCCdVc+OFtpW2YERlb273QbiQqREm5QMNkdmPFireKoI3Svp7uOaP+L8KnilVefXerZqhHNbdqzeea35JlVaaYj4Tdq1g/Np7ed+5etldVcRDBQCgOyOfE2Fvd5rP3UUOLxUBvLwNcrDJNGpA8GElWJldmVFARti3JgEVmGVZWdS+rxoUlrfYuPoPGvWjb03UnuNYuoGtbzX+qbvUl1YWtgk3GO2srVSIbWBAFSNdySdgO7MSzMWZiWYk29Y2VPD6EbelsXa+MhNzcSuajqT3kdrLPAUAoBQCgFAKAUAoBQGwfSXpLaaTtbPXmvMdFc5W5jS6wmEuow6RRsA0d7eRt2IIIaGBhs+4kkHhcEnhWkOkPes7O0evZKS3ci5eN7ufZIMMwzhZVqy1bl7X/AJ2bZ7d3d1f3U19fXMtzc3MjSzTSuXeR2O7MzHuSSSST3JNQEkZ1UAoC0NJ9ObXHQw5PVFu0l9zEkdg+3hxLsdhMpG7PuVPDcBeOz8iWRaM097qngE54XgjTnslU3RfFHja4927jJ5o/on4RGN1fao7VHj5+TkJlLLJM7SSOWZiSSTuST7a+dJzlUk5zebett7WWXGKglGKySONdTkUAoBQCgFAKA7bcQczJdTiC3iUyTzFWYRRKOTuQoLEKoY9gT27A1scIw2pjGIUcPpbaklHmzetvkW18hi311Gytp3E9kU2UPm8xfagytzmMjIWnuW325swRQAEjXkSQiqFVQSdlUD2V9zWdrTsbena0VlCEVFc0VkuxFC1qsq9SVWe2TbfO9ZhVknmKAUBVHX/W03pKdMMXkIZLHETm4yjWs0csVzkdivaRFHNYkPADk6BzMyMRJVmaMYX4Hb+EVV58+xcXTtIpi153+p3qD81espupOacUAoBQCgFAKAUAoBQFt9Eunfp//aJmGMVpi7yNcXBNjvHhyN2hV3VjIPCMcSlC6nkSZIl4FWdkjOkmMeAUvB6Xz5rj+auPjz4vgbfCrHwiffZ/Nj2/5vLlu7u6v7qa+vrmW5ubmRpZppXLvI7HdmZj3JJJJJ7kmqyJYdVAKAtbQei4cHBb6jyoimyE8SXFlGrB0tkdQySEgkGUgggf7vfc+v8A93QvdO7ok7ac8CwqWUtlSa3f8Y8u6T6OMsDRXRyNZRv7tZr6K4+V+zrJUSWO5NfPJZAoBQCgFAKAUAoBQEa6kZi3xumWxXGGW5yzBApILQxRsrs+wcFSWCKpZSpHi+RUEXj3FtH5V7qrjlVebDOEPxPLN9EXlr+tq1rVAtN8RUKUbGD1y858y2db9RUlfR5WgoBQGLnMwNLaayerXmng/FsXG1lhYo3prgi3VX4sAwYGTY7bpDJsQRW2wSylfXsKa2J5vmRh39dW9CUt+xc5qe7s7s7sWZiSSTuSat0hJ8ocCgFAKAUAoBQCgFAehp/CX2pc5YYDGiL0rIXEdtEZZkijDOwALu5Coo33LMQAASSAK861aFvTlVqPJRWbO9OEqs1CO1m1phsrC0ssHiJJWxmIt1srESB1JiUklyjSSeG0jtJK6K5QPK/HYbVTV7dTvbidxPbJ/wDxdC1E6oUY29NU47jjWKewoCe9NNJW1+JdTZm1iuLK3doLWJpVPO6XgxMkexLRqjb7HiGZlHrAOtVn3TNMnoxh6t7SWVxV+b/xW+XsXLm9xJ9GMF8a3PfKq/hw28r3L2v4liyyyTSNLK7M7kszMdySfMmvk2c5VJOc3m3rbe1st+MYwioxWSRxrqdhQCgFAKAUAoBQH1F5MBtvTJvUtrOG8lmyo+omZbMapuUVoWgxxNjA0MkciOqM3JxIgAcM5dwd22DABiAK+2NDcAjo3g1GxyynlnP8b27NWr5urckUZjN+8SvZ1881nkuZbOvbzsjVSg1YoBQFYfhD5V4cbpnTaTWTpIlxlpDCvyyl38BY5WKgnb0dnVd2AExI2LMKsLQ634FCpXa1t5dCIzjlXOpGmtxSdTE0QoBQCgFAKAUAoBQCgLm/B8xZsjldWGKVbgxNjLOYc08MSL/SGV1dd2MRERVgylJ5NwDxNQ7TC8dOjC1j9LW+ZbO3X0G+wS3Upus92pdP+dpatV6SUUB34+xucpf22MskV7i7mSCFWdUBd2CqCzEKo3I7kgD2mvOtVhQpyq1HlGKbb4ktbZ2jGU5KMVm2X56Pa42ztMHjpWkssbCLeBiGHMblmk4szcC7s8hUMQC5A7AV8V6ZaQz0nxirfN+ZnwYLiitnNnteWrNsu/A8NWF2UKH0tsud+7YuQ4VFzbigFAKAUAoBQCgFAYWocvLpzT93m4XuIpk2gtZoXeNkuXDeGVkUHiy8XkG+2/hEAg7VYncvwGWNaQ0qr/06H8RvlT81bHtllmtWpPJ5kZ0rxCNjh8qa+dU81cz2vq7WijK+vCnRQCgFAa99Zs0+b6g30r28EItYbWzVIYljXaKBE5EDtyYgsx82ZiT3Jq3MCpKjh1KK3rPr1kKxGbqXU29zy6iEVtzBFAKAUAoBQCgFAKAAbnagNntD4A6c0jibCSO2E0trHeSvBKJA5mUSqWKkgMFdVK9ipXiwDBqqfSG68LxCbWyPmro29uZNMNo95tore9fX8D3a0hnigPR03NbW+osXPe3SW1vHewPLM6syxoHBZiFBYgDc7AE9uwNa7GLOeIYdXs6bSlUhKKb2Zyi0s+TWZNnWjb3FOtLZGSfU8y621J03LE/GLjTv3/8AB3/u1fOa7iGO/aKPXP8AYWG9PrRf/wAKn6P3nz4R9N/rExv2O/8Adq5+RHHftNHrqfsHl/aegqfo/ePhH03+sTG/Y7/3anyI479po9dT9g8v7T0FT9H7x8I+m/1iY37Hf+7U+RHHftNHrqfsHl/aegqfo/ePhH03+sTG/Y7/AN2p8iOO/aaPXU/YPL+09BU/R+8fCPpv9YmN+x3/ALtT5Ecd+00eup+weX9p6Cp+j94+EfTf6xMb9jv/AHanyI479po9dT9g8v7T0FT9H7x8I+m/1iY37Hf+7U+RHHftNHrqfsHl/aegqfo/ePhH03+sTG/Y7/3anyI479po9dT9g8v7T0FT9H7wNR9NydvjFxo/WbO/7fu1cfIjjv2ij11P2BafWjeToVP0fvKz6jalxeevbW3w0rzW1ksoaZ4TH4khcjdNzuUKJGQWVG3ZgV8quLuf6HPQ7D50K8ozrTlnKUeFlktUYrPLUtbz4KecmnmkiI4/jfjutGpCLjCK1J5Z5vbnlnyLa1q5SIVOzQigFAKA1m6if14zP+KP+gq4sJ/kKP4V6iD338zPnfrI7WxMQUAoBQCgFAKAUAoDvsoTcXkMADHxJFX1VLHuduwHc/srhvJNnaKzaRtxcywzXMs1vZw2kUjsyW8JYxwqT2ReZZuIHYcmJ2Hck96o+UpTblN5t7XxssBJJZI666nIoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKA1m6if14zP+KP+gq4sJ/kKP4V6iD338zPnfrI7WxMQUAoBQCgFAKAUAoCV9K1vR1CwV1jzELixvI71PFiSRPkWEh3RwVYer81gQfIg1r8Wn3uwrS/4v1GVZR4VxBcqNkKpwnIoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUBrN1E/rxmf8Uf9BVxYT/IUfwr1EHvv5mfO/WR2tiYgoBQCgFAKAUAoBQE06PEDX9iWIHyU47/AJ/CatVjf+3VuZmZh/8AMw5zYeqhJuKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAazdRARrjMgjb+kn/QVcWE/wAhR/CvUQe+/mZ879ZHa2JiCgFAKAUAoBQCgFAetpPKLhdTYvLPbJcpa3cUrQyOypKocEqxXZgD5HbvXhdUVcUJ0pbJJo9aM3SqRmtzzNr8ri77CZS8wuTg8G8sLiS1uI+atwlRirLupIOxBG4JH5qpMn20xaAheuNeZrQ08D32kvGx97y9EvUvfk5Su3NDsh4uu43QnfZlbyYEyjC9HaOKUe+U7jJ71wdnaus1F3ik7SpwJU+Z57ewi/x+r9Ff37+XWy8ivv8A9P8AcYvj77vt+A+P1for+/fy6eRX3/6f7h4++77fgPj9X6K/v38unkV9/wDp/uHj77vt+A+P1for+/fy6eRX3/6f7h4++77fgPj9X6K/v38unkV9/wDp/uHj77vt+A+P1for+/fy6eRX3/6f7h4++77fgPj9X6K/v38unkV9/wDp/uHj77vt+A+P1for+/fy6eRX3/6f7h4++77fgPj9X6K/v38unkV9/wDp/uHj77vt+Bm4brvhbjKW0Gfwt3Y495ALi4tHW5ljTfuVibww5/UXX9tdKmhc1FunWTfE45dub9R2jj0W/Ohkuf4Fn4eSy1HgItSabydtlbQxtJdrbFjLYESKnG4jIDR7mSPi+3Bi4CsWDKsXvsNucOnwK8enc+k29vdUrqPCpv3isAyBQCgFAKA146wY78Xa8vtplmS5SG4V1DbetEu6+sAd1bdT7N1OxI2JtzAasa2HUnHcsurUQrEYOF1NPjz6yF1tzBFAKAUAoBQCgFAKAA7HegNpdI5SPN6Tw+XF/FczXVr/AElVZmeGZHaNlkJUDkeAk7bjjIvffcCo8dtPA7+pDc3muZ/HNE2w+t3+3jLetXUetWoM0TLbXlhPiMnY29/jrpo3uLS5TlHIUbdT22ZGHrDmhVwruAwDHfJtbutZVO+0JZM8q1GFePAqLNFFdV+lLaOcaj04ZrvTV3KI0eQhprCYgn0ecjz7A8JNgJFB7BldFs/Bsap4rTyeqotq9qIjf2ErOWa1xexlc1uzXigFAKAUAoBQCgFAZ+Cz+c0xlLfN6cy95jMhaOJYLq0maKWNwdwyspBBrpUpwrRcKiTT3M7QnKD4UXky5dO9eLbPvZWOrcdY465ht0tmv7SLworkoNleWNfVWQjZSyAK2wZhyLu0JxbRTPOtY/lfs9z60SCzxn6Fx1+8sYEMAykEEbgj21BpRcW4yWTRIE01mj7XByKAUBWP4RFkt3jdM5yNLRHtIp8TMsMTrIVEjTxyysRwZmM8qLsd+MABUbAtYOh1zwqNS3e1PPof/wAI1jtLKcai36ikqmRoRQCgFAKAUAoBQCgFAXD0F1KgTI6NmhV5LhlyFm5aQshjRhNGir6nrIVdiw3AtxsR3DRHS6xdahG6hthqfM/d7zeYJcKFR0pb9nOW1VdEnFAcmSyu7C/w2Vsku8dlbY2l5Edg5j5q4MbkExurojKw9q7EMpZWyrO7qWNeNeltR416Mbim6c9jNbupHT++6e5uOyllkucffw+l4y8aExelW/Nk5cT5Mro6MASoZG2ZhsTbWG4hTxOgq9PpXEyF3dtK0qOnLoInWeYwoBQCgFAKAUAoBQCgLG0F1by+GNng9R39xeYa2j8C2EjFzYoXZ9o9+4j5O7FB23ZmHcnePY1gNLEYOpSSjU4+Pkfv3G0sMSnatRnrj6uYvGCeG6hjubaVJYpVDo6HdWU+RBqsatKdCbp1FlJbUS2E41IqcHmmdleZ2FAYOpcHHqzSOX0vPdzxePCby0RXfw2voFZoQ0aq3NmDSwr5cTPuWC8t9zgF74DfRm9kvNfS0YOI0PCLeUd619RqmQQSD5jsatohR8oBQCgFAKAUAoBQCgMzD5S7wmUtMvYsq3FnMk0fJQy7qd9iDuCD5EEbEV51aUa9OVKazTWT6TvCbpyU47UbR4fM47UWKtc7igy216hkWJ5UkkhIYqyPx8iGU+YUkcW4gMKp/ErCeG3MreevLY+NcZN7S4V1SVRGZWAZIoDGzWnsPrLCXGl8/LHBBKHltLxoDI1ldcDwkGxDBGIVZAOW6d+DskYG1wjFKmF11NPzXtXGveYd7aRu6bi9u5mredwmV01mr7T2cspbPI424ktbq3lUq8UqMVZSD3BBBq26dSFaCqQeaetEKnCUJOMtqMGu51FAKAUAoBQCgFAKAUBZvSTqNBgFk0vmkjNpeTRvbXbs3K0ccgyD1gojfkpYkEgouxUF+UZ0iwXxjBV6P+pHtXFz8Rt8Lv8AwaXe6nzX2F3VWRLBQHbaXd1YXUN9Y3Mttc20iywzROUeN1O6srDuCCAQR3BFAUV150fbae1cM/h7aOHD6kQ39vFEAEtpiSJ7cDm5UJIG4B25mJomIHIVbGAYh4ws05Pzo6n7+khmJW3g1d5bHrRWlbs14oBQCgFAKAUAoBQCgLQ6J62kxuQbRmSvljxuUlD23jyKkVvedgGLMDwV19Ru6qT4bOdoxUc0kwvw+277TX8SHat69xtcKu/B6vBm/Nfr4y66q8lwoBQEG62aLGpdMnW2Msj+MNOwRxZMx+I7XFkZOEdw+4Kp4TPFCTyAKvCAu6sxnGieKZPwGq9T1x9q9pH8Zs814RDp95r7U7I4KAUAoBQCgFAKAUAoB5UBsN0Z1Bcap0ze2s8xlvcCsTSrwdne1digmJClVVHMcbFmBLSxbBtztXGlOFq1rK6p/Nnt5H8dvPmSrB7zv1PvMtsfV8Ca1EzcigOWTwMfUDSt305yGTgtY7uT0zFzXcwjt7TIqNldmKMUWRAYW7ou7RvI3GEbbbBcSeGXSqv5r1Pm+BhX9r4XRcFt3GpF7ZXeNvJ8ff27wXNtI0UsTjZkdTsQR+2rbjJTSlF5pkKacXkzprscCgFAKAUAoBQCgFAfQSpBB2I8jQGxnTHXo1xhmtcrdw/j3Fxb3DSNwkvoeYCzbs20koLqrhQCQA+zHxGFcaTYN4JU8LorzJbVxP3P1kqwq+7/AB71UfnLtXvJdUTNyKAzcLe2uOyttd5Cya9slcLeWYnaH0u2b1ZoC691WSMuhI9jHsa706kqU1ODya1o6yipxcZbGa3dZunj9MOoWS0xFO1zjjwvcVdlCnpVhOokt5eJ7ryjZd1PcHcHYgiriw29jiFrC4W/bz7yD3VB21V02Qis4xhQCgFAKAUAoBQCgFASXp1q4aJ1fYZ6a3a4s0Yw30CiPlLayApKqGRHVX4MSjlTwcKwG6isLELON/azt5b1q5HufWZFrXdtVjUW42Xc2rOzWN/BfWxJMN1AHEc6f3ZEDqrcWGxHJQdj3APaqcqU5UpunNZNPJ86JzGSnFSjsZ8rodhQHi9XunGQ6wY6bXGFniudZYm2JyVkIuM2Xs41LG7V+Xy1xGvISDYM0aLJ67CVhNNGscjQ/wDx3L1N+a+Lk5jQ4rh7qfx6W3evaavVPyNCgFAKAUAoBQCgFAKAzsHm8lp3K2+ZxFyYLq2bkjgAg9tirA9mUgkFT2IJBryrUadxTdKqs4vad6dSVKSnB5NGzuA1PitaYz4Q4ZIoY5H2uLOPn/QZW3PgnmWbjsDwYs3JR58gwWp8XwqrhdZwlri9j4/iTSyvIXkM1t3o9CtSZgoDyesOljr/AKS/jS0g55rp9ym9RfWlw88vygOygfI3EgbdmLMLo7erH2l2ieId4ru1m9U9nP8AFGkxm275TVaO1eo1aqxSLigFAKAUAoBQCgFAKAUBsZ0p1CM7oqxt5IYI58UGspGSRjJMoYukjqWPE8XEY4hVIiHYtyJrDSmyVrfd8gtU1n07/f0kuwiu61vwZPXHV0biX1GzaigO20u7qwuob6xuZba5tpFlhmico8bqd1ZWHcEEAgjuCKAgHWfovj8vYXfU7pdjPBhhAlz+n4eTtjmYgek24JLPasxA7ktEzBWJBR3sXR/SBXSVtdPKa2Pj+JF8SwzvL79RXm71xGvxBB2I2IqXGkFAKAUAoBQCgFAKAUBJdA65yeg8y9/ZtLJaXkQtchapMYxdW/NX4Ej2h0R13BAZFJB22rBxGwpYlQdCr0PifGZNpcytKiqRNjMVlMbncZBmcPdC4s7kHg+2zKw+cjr/AHXXcbr+sEEqVJqe/sK2HVnRrLme5rjRM7a4hdU1UgZVYR7mXiXsFyMC5eW8THTN4F/6GwE7Wsg4TKm5AJaNnXYnY77HsTXrRqyoVI1Y7U0+o6zgqkXB7Gasa+0pLobWmZ0lJdw3Yxd5Lbx3MDcoriMMeEqMOzIy7MCOxBFXNa3EbuhCvH6STIHXpOjUlTe48Csg8hQCgFAKAUAoBQCgFAWl0Hys8OWyOF8WFbe6t1uCrhebSRtxAVj63zZGJUeewJ+aNonpfb98s41ktcX2P45G7wOo41pQz1Ndv+Zl01XBKBQCgO20u7qwuob6xuZba5tpFlhmico8bqd1ZWHcEEAgjuCKAjfUXpHbdYcw+a0bZ2GI1VPbl7iwUiO3zV0Cd/R0VQsE7jY+H8yR+QTgWSIzTA9Je8RVtea1ulxc/JymixDCu+N1aG3evca1X1hfYu7lsMlZzWtzAxSSGZCjow8wQe4qexlGaUovNMjTTi8mdFdjgUAoBQCgFAKAUAoCUaD17k9DZJpoE9JsLnZbyzdiFlA32YH+7Iu5Kt7NyCCpZTr8Sw2jidF0qu3c96ZlWl1O0qKcdm9cZsXjcni85joMzhLz0qxud/CkICupHmkigng47brufMEEqVY1Tf2FbDqzo1lr3Pc1xomVvcQuYKpAyKwj3K5/CVx5ytpprXIht1m9G/EV6ySoZJGtgvgSvGoHhjwHjiBO/M27tuTy2sTRC777bztpPXF5rmfxIxjdDg1FVW8oqpeaMUAoBQCgFAKAUAoBQEy6RSBdfY5SN+azqO3l8kx/+K0WkuvC6n/X/wBI2WEvK7j0+pmxNVSTEUAoBQCgGpLHTuurKGx13glyj2lstrZ38Mno9/bRoriNBMARIgLIOMqOQkaohjHltsOxm6wx5UnnHiez4GHdWNG71zWvjIVN+Dx0uEriDqJqto9/VLYC2UkfrHpR2/zNSRaZ8dHtNS8C16pnD8njpn9YOqfuK295p5Zr0PaPET+uPyeOmf1g6p+4rb3mnlmvQ9o8RP64/J46Z/WDqn7itveaeWa9D2jxE/rj8njpn9YOqfuK295p5Zr0PaPET+uPyeOmf1g6p+4rb3mnlmvQ9o8RP64/J46Z/WDqn7itveaeWa9D2jxE/rj8njpn9YOqfuK295p5Zr0PaPET+uPyeOmf1g6p+4rb3mnlmvQ9o8RP64/J46Z/WDqn7itveaeWa9D2jxE/rns6e6Y6a0U73OntfakuxIwaWwucbDBb3BAZVLlZ3IK8mIIXf2dgTWtxbSGnilv3qVJJ7nxGZZYY7Spw+H0cfOe/UXNsedrLGzai6dak05Ek8r+AmWtooYEfee05MWdzsyItu90Tx33PHceTLvtG7rwbEIZ7Jan0/E12K0u+2sst2s1Vq1SGigFAKAUAoBQCgFAKAl/SX+0HFf8AP/6ElaLSX/a6v/X/ANI2OFfzkOn1M2MqqSZCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoDLxN8mPyMNzOk8lvuY7mKCcwvPbuCk0XPY8Q8bOh3BGzHcEdj3p1JUpqpHann1HWUVOLi9jNUNYaevdJarzGl8lA0F1ib6eymjYbFHjcqQf2EVddCrGvSjVjsaTIDUg6c3F7jyK9ToKAUAoBQCgFAKAUBL+kv9oOK/5/8A0JK0Wkv+11f+v/pGxwr+ch0+pmxlVSTIUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKApL8I4Pc9VMhqB7w3kmegt8ncXHhGMSXUkSm52Xio7TeIp4jjuDx7bGrZ0erd+w2m+LV1EMxSn3u6ly6+srGt0a8UAoBQCgFAKAUAoCX9Jf7QcV/z/8AoSVotJf9rq/9f/SNjhX85Dp9TNjKqkmQoBQCgFAKAyMdYXWVyFri7GMSXN5MlvChdUDO7BVBZiAO5HckAe2ulSpCjB1Kjyilm3xJbTmMXJqMdrLktumHS2G3jiv/AIT3FyigSyw5CCKN29rKht3Kg/mLNt+c1RdTu5W8ZuMbKTS398Wvl+aTynoHXcU511n+F9H0ty28e3JbDt+LXpD+jat+9rb3Suny50PsMv6i/ad/IOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LTpGfm22rd/P/a1t7rRd3Oh9hl/UX7Th6B1ctVdfl+JTWZxsuGzF9h5xIJLG5ltnEkfBwyMVPJdzxO47jftV4WFxO7taVxUg4SnGMnF7YtpNxezWtj1IgtemqNWVOMuEk2s1seT2rnMOso8imfwg/8AbWB/9Mb/ANxJVnaKf7cudkSxn+Z6EVVUlNSKAUAoBQCgFAKAUBOujNrLPreGaNCy29vNI5BA4grx3O/n3YDt37/m3qP6UTUcMmnvaS60/YbPCE3dRa3Z+o2BqrCYCgFAKAUAoCxOkWFuEurrVzvPDFZo9nashZPFmlQrIN+JVlWFmDAMGBli8wTVZ91bHlg2Ayt4PKpX8xceW2T5ssk1/wAiTaJWPhuIqTWcafnPn+jy7c2uYnhO53NfJaWRcQoBQCgFAKAUAoBQGJmM/HpXGNnpLOK6MUiJDBNz8OWU7lVYr322VmI3XcIQCCQam/c90b8pcbp0akc6VPz58y2LavnPJateTz3Gg0kxPxZYylF+fLVHp39C1lFV9klLCgKa/CISS31HhbS4ieKeLFK7xyIVYLJI0kbbH2NG6OD5FWBHY1Z+iqaw5PlZEsZf/wCl8yKpqSGpFAKAUAoBQCgFAKAuLoHibIwZnNzPcreI0FrbKI1MLxNzaYs2+4YFYNgAQQz7kbDeFaZV8qdK3W9t9Wpetm/wKnnKdTi1df8A8LZqAkkFAKAUAoBQF74XDDTen7DBm3khuEjE96ssbxyekyAF1dGJ4sg4xEDjv4W5AJNfJHdVxxYxpDOjD5lBcBc6+d+rNcqSLf0QsXZ4cqk/nVHwuj6O5bsm+Jt62ZNVsSkUAoBQCgFAKAUByiieaRYo1LM5CgAbkk12hCVSShBZyepLjZxKSgnKTySK06m6mF/kvxBicsbjFWnhu/gykwT3QU8nA2HLhzaMH1h2ZlOz19gdzvRNaK4Uo1f9arlKfJq1R/65vpb3ZFMaSYv42u84/Mhmly8vT6iEVPiPnbaWl1f3UNjY20tzc3MixQwxIXeR2OyqqjuSSQAB3JNAa/8AXrKDJ9WdQQxZs5e2xU64e0vePET29qggjYLudlKxjYbnYbDergwah4NYUqeWTyzfO9pCL+p325nLlK/rZmGKAUAoBQCgFAKAUBs304xowvT7C45L28c3AlyVxbykeDDcTEDeIBiDygituTEKeSlSNlBNWaTXSucQlwdkUo9Wt9ry6CY4VRdG2We/X/nQSCo+bIUAoBQCgJl0lxtrf6yhusjiIMlY42Ca8uIJ3URkheERZSflFEzw7pseQ3BBXlUb0uxvydwaviC+dFeb+J6lz5Z55cSZssHsfGN7Tt3sb18y1v3FozSvPK80jFmdixJ8yT7a+JZzlVk6k3m283zsvSMVCKjHYjhXU7CgFAKAUAoBQADc7CmwHia41b8EsYLPF3xiz13wZfDG7WluVJMhbf5OVvU4diwUs/qkxsb37kuhLq1Fj2I02lFp0k97T+fx6slly8xXmmOORcXhtB555qfM/o9O/qKar6JK6FAd1xl7TR+lM7r++Yj8TQCHHqsnFpMnOGW224urDhxkn5AMvyAVh64ra4LYu/vYU9y1vmRh39wrahKW/YjT93eR2kkYszksxPmSfM1b3MQnafKHAoBQCgFAKAUAoD3dEaak1bqexwiv4cczl55N1BSFAWkYcmUFuKniu4LNso7kVi3t3Cxt5XE9iR729CVxVVOG82dVURQkaKiqNlVQAAPzADsBVMTnKpJzk829ZO4xUUorYj7XU5FAKAUAoC5+n+Fn09o5ZbiWZJ8+6XkkBJCrBGHWAspUHkQ8rggspSSMjbvXzp3asejWr0cFpP5nnz4s381PlS180iydB8PcITvZrbqXMtvbq6D2aoon4oBQCgFAKAUAA37CmwHiav1hBpGAW1ssU+Xnj5RxuAy2ysO0sg9reRRD59mYceKvcvc47nDxiUcVxaOVBfNi/p8r4ort5iEaTaTK0Ts7N+fvf1fj6inbi4nu55Lq6nkmmmcySSSMWZ2J3LEnuST3JNfTMYxhFRiskir5Scnm9pwrscGTjMbeZjJWmIx0Qlu76eO2gQuqBpHYKo5MQo3JHckAe00BS/X/AKkWmoshaaD0vdGTTmm3c+IHZlvsi6ItzdDcD1CY1SMcV+TjQkcyxNp6PYV4ut+HUX8SW3kW5e8h+J3nhVXgxfmoqOpAawUAoBQCgFAKAUAoC/OimmlwulpNQysReZ0lFCt8yzjfsDxkPz5VLFHQECGJlJD1X+l2Id8qxs4PVHW+d7OpevkJNglu4QdZ/S1Lmz9/qJ/UMN6KAUAoBQHraT09NqrUVlgopfBFy5M02ykwwopeWQKzKGKxq7cdwW22HcisW+vKOHW1S7rvKEE5PmSz6+LlPWjRncVI0qazcmkukvC7a2M3CxthbWsQEVvAHZxFEoCogLEk8VAG5JPbzr4bxjE6mM4hWxCpqdSTllxZvUugvmxtY2NtC3j9FJHTWtMoUAoBQCgFAco45JWCRozMTsABuSa5jFzkoRWbexLacNqKzewj+sNa2GlPSMVZMbjPQsqMpjVoLVvW5ByT60q7L8nxKgt6x3Rozeug/cnncd7xLHdUdqpZa3+Pi5tr5N8Ax7S6MFK2sNb2OW7o4+f1lQ3FxcXlxLd3c8k887tJLLIxZ3cncsxPckk7kmvoiEI04qEFklsRXDbbzZ112OBQEM6y9Q7rQdlLoTBSxwahvo3TMXUcpaawt2HH0MDYeFMw5eLsWYIyxngfGRpzozgikle3Mfwp+v3dZHsWv2n3ik+f3Gu9TojooBQCgFAKAUAoBQEr6baMfWeoVt5kBx1iEusjtcpDI1v4iKyxFt95G5gAKrEDdipVWI1uK4jDC7Z1pa3sS42ZVnbSuqqprpNj0HCGGAMxS3hjt4gzFuEcahEUE+xVVVA9gAFVFVqzrzdSo85PWybwioRUY7Efa8zsKAUAoBQFn9I8TFb4zJ6luLZWlldcfZyM0bBNgHnIUgur7GBQ44grJKvrbnane7JjrsMJhhtJ+dXev8Mdfa8snyNEz0Lw/wAIvHczWqmtXO/cvWTGvmEtUUAoBQCgABJ2A3pnkDjkJ7PD498rmLpLW2VHaPkRznK8QUiUkGRt3TcL5cgWKruwlejWheL6U1ErOm1T31JaorZnr3vWtSzeWvLI0+J45Z4VF99mnP6q278tW5anr2Fd6s6m3GRSbFaajlscfKkkE0sgQ3F1GX7E7A+CCgAKIx+c4Lup2H0rol3OcK0VyrL+LX+vJbPwrXwetvlSeRWGL6SXeLZw+ZD6q9r39hBasAjwoDutLK8yE3o1haTXMvB5PDhjLtwRS7tsO+yqrMT7ACT2FcpOTyW04bSWbIP1G6z2ug5jpzQE1pe6ggYm7zsb+LHYycSvhWex4O68iWuNm2dUMJHDxZJzgejMZRVxfLmj7/d1kfxDFWm6VB879xrxJI8sjSyuzu5LMzHcsT5kn2mpyR440OBQCgFAKAUAoBQGbhsPkM7kIsZjLZpp5jsFHkB7ST7APaa8bi4pWlJ1qzyij0pUp1pqEFm2bNaf0jidF2X4mxUsNz4ZAnvIuRW6kA2aVeaIwQncqrKCFIBG+9VLi2JVMUuHVk/N+iuJe/j92RNLK1jaUlBbd7PUrWGWKAUAoBQHbaWl1f3UNjY20tzc3MixQwxIXeR2OyqqjuSSQAB3JNAbANaJiLCw09C8TRYm2S13gkkeJpBu0roX9bi8rSP5D5/YAbAfGOn2PPSDHq1xGWdOL4EOLgx3rPjevnZdmjth4vw+FNrKT1vnfu2HVUNN4KAAE9gN6Z5A7IbaedxHDEzuxACqNySf1DvXelSqV5KFKLk3uSzOs5xprObyRi5XKYDT5kjzudtLaeIzo1qreNOJYtuUTRx8jG5J4jxOA337jixFhYP3LNI8WylOl3mPHU1P8uuXZkRy90sw201Rlw3xR19uztIblurwiVotLYZYZFlfje33GZigdWjZYNvDRtlYMrmVdn2GxAY3NgHciwTCJqveN3E1s4SyjuyfATefM24tPYQjENML+9h3ul/DT25PN/myXYk+Ur+/yOQyt017k764vLhlRGmnlaRyqqFUFmJOwVQB+YAD2VaVOnCjBU6aSilkktSSWxJbkiKylKcnKTzbMeu51FAZEyYrDWcWa1jmYcFh5B4guZwGmnjHiAm2g3D3BLQvGOPqB+Id4weQzbLDrm/nwaEW+Xcud/4zwr3NK2jwqjy9ZR3UfrjkdS2Z0xpCCXC6fMAhuhuvpWSYsju1xIo38PnGhSEHggRT6z85GsfCMAoYZFTn51Tj4uYi17iVS6fBjqjxe8q2t+awUAoBQCgFAKAUAoD08BprN6nvDZYXHy3LxqHlZVPCJOQXm7eSruwG59pA8zWPc3VGzpurXlkl/mo9aNGdeXAprNmxGjtFYXR2KghsoZHyMkW1/dSSBhLJzYjwxxBjQKUHEliWVm39YKtW4zjNXFavFBbF7Xy+rdvbmFjYws4ccntf+biQVpjOFAKAUAoBQGfgMguJzuOyrvKi2d3DcFogC4COG3UEjv27dx39tYOJ21S8sa1tRlwZzhKKfE2mk+h6z3takaNeFSazSabXGk9hZ7dT9DMxbw86Nz+iw/8A6188/Ihif2qHVL3FirTq2WrvUuw+DqdobkN485x3G+9pEe3t2+WFdo9w/EW1wrqGXIn7hLTuhl5tJ586ME9W8JDfyBNNXd1ZJKwiY3iQSyRb9iy+HIEYjzALAE+Z863lv3DbSEk7i8lJckFHt4T9Rg1NPKzjlTopPlefsR5OT6tZqdpUxGOssdEbjxYWK+PMkQ5bRsX+TfsV3YRqSVG3EEgyzD+5NozYS4UqUqr/AOcm8vy8HtzNPc6XYpcLJTUeZe/PsI/n9Zam1O8jZrLyzRyOkht41WG3DonBWWGMLGpCk9woPrMfMnee2eG2WHrK0oxp/hio+pI0Fa6r3P8ArTcudt+s8as08BQCgMj0SOCx/HOXv7TE4lZDG+Rv5PCgBDRhwvYtK6iVGMcSvJxPIKRWRbWle8nwKEXJ8nt4jyq1qdCPCqPJFXa1636etIlx+hbW5vrgA+Nkb1RFD3jX1YoBu3qP4m0jP6447xpsQZph+iMVlO9ln/xXtfuyNFdY235tuul+4qHUep9QauyRy+pMtcZC7MccIkmffhEihUjUeSoqqFVRsAAAKmVChStoKnRioxW5GiqVZ1pcKbzZ5dep5igFAKAUAoBQCgFATvR3SLUepokyWQRsRjZYBc21xdwyL6cnjeERb+rs+xWTdiQnyTjlyAU6TFMdtcMTi3wp/VXt4v8AMkzYWmG1rp57I8b9nGXnicBp3TllHjtOYhbKFAweRpWlnuTzYh5XPYuFYJ6iouyA8QSxNb4jiVfE6vfa72bFuXMSq1tadpDgQ6+Mza15kigFAKAUAoBQCgFAKAUAoBQHbaWl1f3UNjY20tzc3MixQwxIXeR2OyqqjuSSQAB3JNAefns1p7S1pJcah1FjbKUQPLHaeP4tzIyyeGYjFFyaJ/nMBKEBVd9+68ttZ4JfXuXe4NLjepf5zGFXxC3oLzpZviWsrjO/hBQWdxbtofAjxLfu11llSdZJBLyR1t9uCjgFVo5DKp9b2EAS2y0QoU/OupcJ8S1L3mmr43UlqpLLtKs1HqvUmrr4ZLUuau8jcLGkSNPKWEcaKFREHkqKoChRsAAAOwqVULelbQ73RiorkNNUqzrS4VR5s8mvY8xQCgFAPI7e2mTByWKV+yRO37FJocnOO1uZmKw28jkeYVSSK4bS2sZNnfaYbLX8nhWOMurh99uMULOd/wBgFdZThH5zS6TlQk9iM2PRerZZ57VNNZMzWyB54/RX5xqSACw23AJI/wAxXlO7t6UeHOokuNvUd40Ks3wYxbZIsF0a1hl5B6ZHb4uDZz4t3J5lV5BQiBn3O4UEgLue5GxI1d1pHh9qs+HwnxR19uztMyjhdzWeTjkuUtvTPTXRmkt3tbAZa82dPTclCr9iJV3jg7xx7o6Hv4jq8YZHWoXiOk15e+ZSfAjybel+7LpN7bYRRoPhT859nUSm5ubm9uZby8uJZ7id2llllcs8jsd2ZmPckkkkmo4bU66AUAoBQCgFAKAUAoBQCgFAKA7bRrVLqF76GWa2WRTNHFKI3dN/WVXKsFJG4BKsAe+x8qAjeosFqTPw3ONj17lcfibhwzY+0CxROFZynicdjKy+IwDPuQCQNh2qS2WOWtil3q1WfG3m+1Gqr4fVuH59V5cWXxIavQbEF+U2ob9wfPZEB/zINbJ6aT3UV+b4GL4hj9fs+JkDoRpcTIRlcqYgPXVnj5E/qYIAB+rY/trr5Z1cv9Fdb9w8Qw+u+o7sb0O0hDemTK3eUu7TlusUMyQyBfzFyjAn9fH/AIV1nplXa8ykk+fP2HaOBU0/OmzJuOimg/Tp5rIZZLVpWaGCe6jkZI9/VVnWNeRA2BIA3PfYeVYz0wv8vmx6n7z1WCW3G+te4z06WdP1WINpuNzGd2JuJgZB+ZuLjt+zavJ6WYjxrq+J3WD2y4+s9DI6A6cX0NrFbaBxmPe258pba4uy0++23MSTMvbY7cQPnHfftt4S0lxOT1VMuhe49FhVovodrOI0No8WrWY03j/Dbbc+AvPsd+z/ADh/wNeXlBiTeffX1L3HdYbarVwF2nu4qPHYXH3GMsNPYDwLmJoZDNhrSeTiw2PGSSNnQ7HsykEHuCDWPUxa+q/Oqy6Hl6j0hZW9PZBev1mPY47H4xg2Nsbe0I8jBEsZH+QFeMr+6n86rJ/9n7z0VvRjsgupHs4rUmosFcNd4PPZHHTud2ktLp4XJ/OSpBrxnXq1FlOTa5WzuqcIvNJGHd3d1f3U19fXMtzc3MjSzTSuXeR2O7MzHuSSSST3JNeR3OqgFAKAUAoBQCgFAKA//9k="
        const doc = new jsPDF()
        const finalY = doc.lastAutoTable.finalY || 10
        const namaProyek = `Scheduling Proyek: ` + formData.namaProyek

        const today = new Date();
        const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        const dateTime = 'Tanggal: ' + date + ' ' + time

        doc.addImage(imgData, "JPEG", 180, 5, 20, 20);
        doc.text('PT.Saba Pratama Surabaya', 14, finalY)
        doc.text(namaProyek, 14, finalY + 15)
        doc.text(dateTime, 140, finalY + 25)

        doc.autoTable({
            startY: finalY + 30,
            html: '#Scheduling',
            useCss: true,
        })
        doc.save('scheduling.pdf')
    }

    const exportPDFPELAPORAN = () => {
        var imgData =
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAOwA7AAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAA7AAAAAQAAADsAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgBFQDvAwERAAIRAQMRAf/EABwAAQACAgMBAAAAAAAAAAAAAAAGBwQIAgMFAf/EAEsQAAIBAwMCAgQICgcFCQAAAAECAwAEBQYREgchEzEUIkHUFhcjMlZXlJUIFRhRVGFxpNLjJDY3QnSRsTVDgYOzJzM0VXW0wdHT/8QAHAEBAAICAwEAAAAAAAAAAAAAAAYHBAUBAgMI/8QARxEAAgECAgQHCwoFBQEBAQAAAAECAwQFEQYhMUESUWFxgZGhBxMUFRYiU7HB0eEXMkJSVGNykqLSIzST4vAzNWKCsvEkQ//aAAwDAQACEQMRAD8A50AoBQCgFAc4YZrmaO3t4nlllYJHGilmdidgAB3JJ9lEs9SGwius+pOktGItsb1czlJIRIbOxkHC2LBwFmmIKhxtGxRA/ZyrNG4IEnwzRi4vUqlfzI9r6N3Sam7xalQ82n5z7CntUdWtZamuhIt6uJto2cwWuNBgWNWYniX3Mkm2+wMjsQNhv2qa22BYfbQ4KpqXLJJvt9hoKuI3NV58Nrm1eo8P4Y6u+lOX+3S/xVkeK7H0MPyr3Hl4Zcekl1sfDHV30py/26X+Kniux9DD8q9w8MuPSS62Phjq76U5f7dL/FTxXY+hh+Ve4eGXHpJdbHwx1d9Kcv8Abpf4qeK7H0MPyr3Dwy49JLrY+GOrvpTl/t0v8VPFdj6GH5V7h4Zcekl1sfDHV30py/26X+Kniux9DD8q9w8MuPSS62Phjq76U5f7dL/FTxXY+hh+Ve4eGXHpJdbHwx1d9Kcv9ul/ip4rsfQw/KvcPDLj0kutj4Y6u+lOX+3S/wAVPFdj6GH5V7h4Zcekl1sfDHV30py/26X+Kniux9DD8q9w8MuPSS62Phhq76U5f7dL/FXPiux9DD8q9w8MuPSS62epiLjqjnlkkw19qW8jhAaWSGedkjBYKCzA7KNyBufaRXhWtMLtlwq1OnFcqivYelOteVXlCUn0sn2P6V9XXliXO69TExz2RvY3Obe7LDYlYiLZpPDlYrtwk4kEjlxB3rSXGKYBRz4FKMmuKC9bWXabClZ4jU+dNrnkyTYzpylnkYXy/ULVuVsR4LSxwXZsZW7KZUDFpgBvzVX28tmKjuo0lbH7R5qjZwXK0n2Ze0z6eG1l8+vLob95Koo0hjSKPlxRQq8nZzsPzsxJJ/WSSfbUaqT75NzaSzeerUuhbkbaMeCkkTPGdKNXXonOSto8J4HNeOUDwyPIpXdBEFaQdn3DMoQ8WHLcbVEcc02wPR7ON5XXDX0Y+dLmyWx87Rt7DA77EddCm8uN6l8ejMk8XSjSdsbmO5zWUv8Adl9GkjjjteKjflzQ+LyJ3XbZhtsfPcbVZindwim44Xa58Upvd+FbPzMllpoJJ67qr0RXtfuPdh0/pGyuprnHaTx0PjJ4ZjkVrlFXkG9UXDScTuo9Yd9txvsSDAsQ7quk9+5KFZU4vdCKWWvPU3nLt1raSC20Rwu3S4UHJre37Fq7DhJgsDK3I4HGD9S2cY/0FRyemGkM3nK+q9FSS9TRs44Lh0dlCH5U/Ycfg9gP/I8f9mT/AOq6+VmP/bq39Wf7jt4nw77PD8kfcR3qFZYXD6bQW2Kx0VzfTiKMi14yBF2d2RlAAI+TU7nuJTsD3ItnuSVsaxvEql7e3VWdGksspVJOLnLUs4ttNJcJ8jUWQ3TGNjZW8behShGcnnmopNJcqWrN5dGZWNfQ5XQoBQCgFAdl0+LwuKj1NqvJDE4I3XojXhTxJJJAhdkgi3DTOFA3A2VTJHzZA4as2xw+4xGp3u3jm9/Euc8Li5p20eFUeRR+uuuWY1BZS6f0pbyYHD3NtHb3wSUtcZHi5kJmf+6hbj8kmy7Rx8ubLzNj4Vo/b4blUl51Tj4uZe0i15idS682OqPEVhW/NYKAUAoBQCgFAKAUAoD6AWIVQST5AUBYem+iGr8pFZ5HP20uCxt7H48Et1CfGuIefEvFEdiw3DbMxVSUYA7gitHiGkFnYZxz4UuJe1mxtsMr3OvLJcbLQwHTHQWn7O1ePCy3+VilMkt3fyrNEwAHFUg4BVG/InmX39XbjseUNvdKb2682l5i5NvWb23wihR1z85kta9vXx9riXu5msbEubW1MhMUBfbnwTyXlxXfYDfYb+VR2pUnVlwqjbfG9Zs4xjBZRWSOmuh2LDwHSO9eOO/1hcSYuPxGU48IRfHg6hg6sNoAw8QAtybdAfDKsGNe6Wd0jCtGP4Kffa2vzItamvrPXwebJvjS2kiwjRq7xXz/AJkONrbzLf6icYrG4PT2z6ew8FlN4aRtc7tJOxCMjMJHJKFw7chHwVt9uOwAFA4/3TMfx+LouapU39GGrPnettPes8uQsPDtFsPw9qfB4clvlr7NntO5nZySzEk9zVfvW83tJEkkskfKHIoBQH1Rudq4fICpOomZtcxqST0Hw2gsoxaLKn++Kkl33DMpHNmCldgUCHYHevs3QDR16NYHStZ/6kvPnySklq5MkknyplI6QYj4zv51V81eauZe95vpIzU0NKKAUAoD7nM5p3p3p2PWWsovSRc8hhsMJCkuVkUlS7FSGjtUYEPINixBjjPLm8W4wfCKuK1clqgtr9i5TBvb6FnDN65PYv8ANxrFrDXWp9dXdtdajyTTrYwejWcCgLDaw8i3CNB2UFmZifNmZmYkkk2hZ2VCwp96t45L185Ea9xUuZcOo82eBWWeAoBQCgFAKAUAoBQCgJvorpFq7Wlg+cgtksMNGXU5C7cRxzOhQNHAD3nkHix7qgPEMGbiu5GrxHGLXDF/FlnLcltMy1sa12/MWrj3F86b0pobQQ20hhBc3ycl/HWVRZbpgfEXlFF3itt0ZD25yI6brNVfYhpDeX+cc+DHiXtZJrXDKFtryzfGzLrQmxFAezpjSmT1XdyW1i0MMcCF5bmcsIo+xKqSqseTEbAAH2k7KGI0mPaRYdo3beFYjU4Mdy2uT4kv8S3tGdh+G3OJ1e9W0c3v4lzlv6fw2E0hbGHA2pa7cgyZG4Ctc7+HwZY2A+RjblIeK9yH2Z3Crt806Wd1LE9IYu2s13ijyPzpLlerU+JJcueWZZ2EaJ2uHtVa/wDEnyrUuZe31GSzFjux3NVhvzJZs1HygFAKAUAoDHyeVgwWHvsxNP4T28DejkLG7NcEERAJIQHHMqzDv6iudjsRU27nuA+UGP0aNSOdOHnz4so7nyN5R6TRaR4h4uw+c4vKUtS537lr6Ch6+yilBQCgFAcs3m9O9O9Ox6z1nD6StzyGGwwkKS5aVSQWYqQ0dqjAh5BsWIMcZ5c3i2+EYRVxWrktUFtfsXKYN7ews4ZvXJ7Eava01pqLqBqK51Rqi+9JvbnioCoEihiUcUhiRdljjRQFVFACgAAValtbUrOkqNFZRRD61adebnN5tnh1kHkKAUAoBQCgFAKAUAoC8+n3Q+1xuNxuruoUPiXN3JDeWWn5AyiWz+eJbtlZXjSUceEakOyMZCUUxGWH45pL4LJ21nrlvlxPiXG+xcuvLe4fhXfUqtfUty4y0b/JXuSdGu5QVhVkghjRY4bdC7P4cUagJEnJ3IRAFHI7AVX05yqSc5vNveySxioLKKyRjV1ORQE80Z06muJLTOamtlXGui3ENsZdpLtSTsGCnlGh47knizKylOzB1rTTjujWmi9N29o1UuX9HPNR5ZZb/wDjnnveSyzk+BaNVsVl3ytnGlx73zZ+vYWKhWG0t8fbIIrSzTwreFd+Ma7kkAfrJJJ8ySSSSSa+XcXxm/x65d3iFRzm+PYuRLYlyItaysbfD6SpW8VFevn4z5WsMsUAoBQCgFAANzsPbTYCCdVc+OFtpW2YERlb273QbiQqREm5QMNkdmPFireKoI3Svp7uOaP+L8KnilVefXerZqhHNbdqzeea35JlVaaYj4Tdq1g/Np7ed+5etldVcRDBQCgOyOfE2Fvd5rP3UUOLxUBvLwNcrDJNGpA8GElWJldmVFARti3JgEVmGVZWdS+rxoUlrfYuPoPGvWjb03UnuNYuoGtbzX+qbvUl1YWtgk3GO2srVSIbWBAFSNdySdgO7MSzMWZiWYk29Y2VPD6EbelsXa+MhNzcSuajqT3kdrLPAUAoBQCgFAKAUAoBQGwfSXpLaaTtbPXmvMdFc5W5jS6wmEuow6RRsA0d7eRt2IIIaGBhs+4kkHhcEnhWkOkPes7O0evZKS3ci5eN7ufZIMMwzhZVqy1bl7X/AJ2bZ7d3d1f3U19fXMtzc3MjSzTSuXeR2O7MzHuSSSST3JNQEkZ1UAoC0NJ9ObXHQw5PVFu0l9zEkdg+3hxLsdhMpG7PuVPDcBeOz8iWRaM097qngE54XgjTnslU3RfFHja4927jJ5o/on4RGN1fao7VHj5+TkJlLLJM7SSOWZiSSTuST7a+dJzlUk5zebett7WWXGKglGKySONdTkUAoBQCgFAKA7bcQczJdTiC3iUyTzFWYRRKOTuQoLEKoY9gT27A1scIw2pjGIUcPpbaklHmzetvkW18hi311Gytp3E9kU2UPm8xfagytzmMjIWnuW325swRQAEjXkSQiqFVQSdlUD2V9zWdrTsbena0VlCEVFc0VkuxFC1qsq9SVWe2TbfO9ZhVknmKAUBVHX/W03pKdMMXkIZLHETm4yjWs0csVzkdivaRFHNYkPADk6BzMyMRJVmaMYX4Hb+EVV58+xcXTtIpi153+p3qD81espupOacUAoBQCgFAKAUAoBQFt9Eunfp//aJmGMVpi7yNcXBNjvHhyN2hV3VjIPCMcSlC6nkSZIl4FWdkjOkmMeAUvB6Xz5rj+auPjz4vgbfCrHwiffZ/Nj2/5vLlu7u6v7qa+vrmW5ubmRpZppXLvI7HdmZj3JJJJJ7kmqyJYdVAKAtbQei4cHBb6jyoimyE8SXFlGrB0tkdQySEgkGUgggf7vfc+v8A93QvdO7ok7ac8CwqWUtlSa3f8Y8u6T6OMsDRXRyNZRv7tZr6K4+V+zrJUSWO5NfPJZAoBQCgFAKAUAoBQEa6kZi3xumWxXGGW5yzBApILQxRsrs+wcFSWCKpZSpHi+RUEXj3FtH5V7qrjlVebDOEPxPLN9EXlr+tq1rVAtN8RUKUbGD1y858y2db9RUlfR5WgoBQGLnMwNLaayerXmng/FsXG1lhYo3prgi3VX4sAwYGTY7bpDJsQRW2wSylfXsKa2J5vmRh39dW9CUt+xc5qe7s7s7sWZiSSTuSat0hJ8ocCgFAKAUAoBQCgFAehp/CX2pc5YYDGiL0rIXEdtEZZkijDOwALu5Coo33LMQAASSAK861aFvTlVqPJRWbO9OEqs1CO1m1phsrC0ssHiJJWxmIt1srESB1JiUklyjSSeG0jtJK6K5QPK/HYbVTV7dTvbidxPbJ/wDxdC1E6oUY29NU47jjWKewoCe9NNJW1+JdTZm1iuLK3doLWJpVPO6XgxMkexLRqjb7HiGZlHrAOtVn3TNMnoxh6t7SWVxV+b/xW+XsXLm9xJ9GMF8a3PfKq/hw28r3L2v4liyyyTSNLK7M7kszMdySfMmvk2c5VJOc3m3rbe1st+MYwioxWSRxrqdhQCgFAKAUAoBQH1F5MBtvTJvUtrOG8lmyo+omZbMapuUVoWgxxNjA0MkciOqM3JxIgAcM5dwd22DABiAK+2NDcAjo3g1GxyynlnP8b27NWr5urckUZjN+8SvZ1881nkuZbOvbzsjVSg1YoBQFYfhD5V4cbpnTaTWTpIlxlpDCvyyl38BY5WKgnb0dnVd2AExI2LMKsLQ634FCpXa1t5dCIzjlXOpGmtxSdTE0QoBQCgFAKAUAoBQCgLm/B8xZsjldWGKVbgxNjLOYc08MSL/SGV1dd2MRERVgylJ5NwDxNQ7TC8dOjC1j9LW+ZbO3X0G+wS3Upus92pdP+dpatV6SUUB34+xucpf22MskV7i7mSCFWdUBd2CqCzEKo3I7kgD2mvOtVhQpyq1HlGKbb4ktbZ2jGU5KMVm2X56Pa42ztMHjpWkssbCLeBiGHMblmk4szcC7s8hUMQC5A7AV8V6ZaQz0nxirfN+ZnwYLiitnNnteWrNsu/A8NWF2UKH0tsud+7YuQ4VFzbigFAKAUAoBQCgFAYWocvLpzT93m4XuIpk2gtZoXeNkuXDeGVkUHiy8XkG+2/hEAg7VYncvwGWNaQ0qr/06H8RvlT81bHtllmtWpPJ5kZ0rxCNjh8qa+dU81cz2vq7WijK+vCnRQCgFAa99Zs0+b6g30r28EItYbWzVIYljXaKBE5EDtyYgsx82ZiT3Jq3MCpKjh1KK3rPr1kKxGbqXU29zy6iEVtzBFAKAUAoBQCgFAKAAbnagNntD4A6c0jibCSO2E0trHeSvBKJA5mUSqWKkgMFdVK9ipXiwDBqqfSG68LxCbWyPmro29uZNMNo95tore9fX8D3a0hnigPR03NbW+osXPe3SW1vHewPLM6syxoHBZiFBYgDc7AE9uwNa7GLOeIYdXs6bSlUhKKb2Zyi0s+TWZNnWjb3FOtLZGSfU8y621J03LE/GLjTv3/8AB3/u1fOa7iGO/aKPXP8AYWG9PrRf/wAKn6P3nz4R9N/rExv2O/8Adq5+RHHftNHrqfsHl/aegqfo/ePhH03+sTG/Y7/3anyI479po9dT9g8v7T0FT9H7x8I+m/1iY37Hf+7U+RHHftNHrqfsHl/aegqfo/ePhH03+sTG/Y7/AN2p8iOO/aaPXU/YPL+09BU/R+8fCPpv9YmN+x3/ALtT5Ecd+00eup+weX9p6Cp+j94+EfTf6xMb9jv/AHanyI479po9dT9g8v7T0FT9H7x8I+m/1iY37Hf+7U+RHHftNHrqfsHl/aegqfo/ePhH03+sTG/Y7/3anyI479po9dT9g8v7T0FT9H7wNR9NydvjFxo/WbO/7fu1cfIjjv2ij11P2BafWjeToVP0fvKz6jalxeevbW3w0rzW1ksoaZ4TH4khcjdNzuUKJGQWVG3ZgV8quLuf6HPQ7D50K8ozrTlnKUeFlktUYrPLUtbz4KecmnmkiI4/jfjutGpCLjCK1J5Z5vbnlnyLa1q5SIVOzQigFAKA1m6if14zP+KP+gq4sJ/kKP4V6iD338zPnfrI7WxMQUAoBQCgFAKAUAoDvsoTcXkMADHxJFX1VLHuduwHc/srhvJNnaKzaRtxcywzXMs1vZw2kUjsyW8JYxwqT2ReZZuIHYcmJ2Hck96o+UpTblN5t7XxssBJJZI666nIoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKA1m6if14zP+KP+gq4sJ/kKP4V6iD338zPnfrI7WxMQUAoBQCgFAKAUAoCV9K1vR1CwV1jzELixvI71PFiSRPkWEh3RwVYer81gQfIg1r8Wn3uwrS/4v1GVZR4VxBcqNkKpwnIoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUBrN1E/rxmf8Uf9BVxYT/IUfwr1EHvv5mfO/WR2tiYgoBQCgFAKAUAoBQE06PEDX9iWIHyU47/AJ/CatVjf+3VuZmZh/8AMw5zYeqhJuKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAazdRARrjMgjb+kn/QVcWE/wAhR/CvUQe+/mZ879ZHa2JiCgFAKAUAoBQCgFAetpPKLhdTYvLPbJcpa3cUrQyOypKocEqxXZgD5HbvXhdUVcUJ0pbJJo9aM3SqRmtzzNr8ri77CZS8wuTg8G8sLiS1uI+atwlRirLupIOxBG4JH5qpMn20xaAheuNeZrQ08D32kvGx97y9EvUvfk5Su3NDsh4uu43QnfZlbyYEyjC9HaOKUe+U7jJ71wdnaus1F3ik7SpwJU+Z57ewi/x+r9Ff37+XWy8ivv8A9P8AcYvj77vt+A+P1for+/fy6eRX3/6f7h4++77fgPj9X6K/v38unkV9/wDp/uHj77vt+A+P1for+/fy6eRX3/6f7h4++77fgPj9X6K/v38unkV9/wDp/uHj77vt+A+P1for+/fy6eRX3/6f7h4++77fgPj9X6K/v38unkV9/wDp/uHj77vt+A+P1for+/fy6eRX3/6f7h4++77fgPj9X6K/v38unkV9/wDp/uHj77vt+Bm4brvhbjKW0Gfwt3Y495ALi4tHW5ljTfuVibww5/UXX9tdKmhc1FunWTfE45dub9R2jj0W/Ohkuf4Fn4eSy1HgItSabydtlbQxtJdrbFjLYESKnG4jIDR7mSPi+3Bi4CsWDKsXvsNucOnwK8enc+k29vdUrqPCpv3isAyBQCgFAKA146wY78Xa8vtplmS5SG4V1DbetEu6+sAd1bdT7N1OxI2JtzAasa2HUnHcsurUQrEYOF1NPjz6yF1tzBFAKAUAoBQCgFAKAA7HegNpdI5SPN6Tw+XF/FczXVr/AElVZmeGZHaNlkJUDkeAk7bjjIvffcCo8dtPA7+pDc3muZ/HNE2w+t3+3jLetXUetWoM0TLbXlhPiMnY29/jrpo3uLS5TlHIUbdT22ZGHrDmhVwruAwDHfJtbutZVO+0JZM8q1GFePAqLNFFdV+lLaOcaj04ZrvTV3KI0eQhprCYgn0ecjz7A8JNgJFB7BldFs/Bsap4rTyeqotq9qIjf2ErOWa1xexlc1uzXigFAKAUAoBQCgFAZ+Cz+c0xlLfN6cy95jMhaOJYLq0maKWNwdwyspBBrpUpwrRcKiTT3M7QnKD4UXky5dO9eLbPvZWOrcdY465ht0tmv7SLworkoNleWNfVWQjZSyAK2wZhyLu0JxbRTPOtY/lfs9z60SCzxn6Fx1+8sYEMAykEEbgj21BpRcW4yWTRIE01mj7XByKAUBWP4RFkt3jdM5yNLRHtIp8TMsMTrIVEjTxyysRwZmM8qLsd+MABUbAtYOh1zwqNS3e1PPof/wAI1jtLKcai36ikqmRoRQCgFAKAUAoBQCgFAXD0F1KgTI6NmhV5LhlyFm5aQshjRhNGir6nrIVdiw3AtxsR3DRHS6xdahG6hthqfM/d7zeYJcKFR0pb9nOW1VdEnFAcmSyu7C/w2Vsku8dlbY2l5Edg5j5q4MbkExurojKw9q7EMpZWyrO7qWNeNeltR416Mbim6c9jNbupHT++6e5uOyllkucffw+l4y8aExelW/Nk5cT5Mro6MASoZG2ZhsTbWG4hTxOgq9PpXEyF3dtK0qOnLoInWeYwoBQCgFAKAUAoBQCgLG0F1by+GNng9R39xeYa2j8C2EjFzYoXZ9o9+4j5O7FB23ZmHcnePY1gNLEYOpSSjU4+Pkfv3G0sMSnatRnrj6uYvGCeG6hjubaVJYpVDo6HdWU+RBqsatKdCbp1FlJbUS2E41IqcHmmdleZ2FAYOpcHHqzSOX0vPdzxePCby0RXfw2voFZoQ0aq3NmDSwr5cTPuWC8t9zgF74DfRm9kvNfS0YOI0PCLeUd619RqmQQSD5jsatohR8oBQCgFAKAUAoBQCgMzD5S7wmUtMvYsq3FnMk0fJQy7qd9iDuCD5EEbEV51aUa9OVKazTWT6TvCbpyU47UbR4fM47UWKtc7igy216hkWJ5UkkhIYqyPx8iGU+YUkcW4gMKp/ErCeG3MreevLY+NcZN7S4V1SVRGZWAZIoDGzWnsPrLCXGl8/LHBBKHltLxoDI1ldcDwkGxDBGIVZAOW6d+DskYG1wjFKmF11NPzXtXGveYd7aRu6bi9u5mredwmV01mr7T2cspbPI424ktbq3lUq8UqMVZSD3BBBq26dSFaCqQeaetEKnCUJOMtqMGu51FAKAUAoBQCgFAKAUBZvSTqNBgFk0vmkjNpeTRvbXbs3K0ccgyD1gojfkpYkEgouxUF+UZ0iwXxjBV6P+pHtXFz8Rt8Lv8AwaXe6nzX2F3VWRLBQHbaXd1YXUN9Y3Mttc20iywzROUeN1O6srDuCCAQR3BFAUV150fbae1cM/h7aOHD6kQ39vFEAEtpiSJ7cDm5UJIG4B25mJomIHIVbGAYh4ws05Pzo6n7+khmJW3g1d5bHrRWlbs14oBQCgFAKAUAoBQCgLQ6J62kxuQbRmSvljxuUlD23jyKkVvedgGLMDwV19Ru6qT4bOdoxUc0kwvw+277TX8SHat69xtcKu/B6vBm/Nfr4y66q8lwoBQEG62aLGpdMnW2Msj+MNOwRxZMx+I7XFkZOEdw+4Kp4TPFCTyAKvCAu6sxnGieKZPwGq9T1x9q9pH8Zs814RDp95r7U7I4KAUAoBQCgFAKAUAoB5UBsN0Z1Bcap0ze2s8xlvcCsTSrwdne1digmJClVVHMcbFmBLSxbBtztXGlOFq1rK6p/Nnt5H8dvPmSrB7zv1PvMtsfV8Ca1EzcigOWTwMfUDSt305yGTgtY7uT0zFzXcwjt7TIqNldmKMUWRAYW7ou7RvI3GEbbbBcSeGXSqv5r1Pm+BhX9r4XRcFt3GpF7ZXeNvJ8ff27wXNtI0UsTjZkdTsQR+2rbjJTSlF5pkKacXkzprscCgFAKAUAoBQCgFAfQSpBB2I8jQGxnTHXo1xhmtcrdw/j3Fxb3DSNwkvoeYCzbs20koLqrhQCQA+zHxGFcaTYN4JU8LorzJbVxP3P1kqwq+7/AB71UfnLtXvJdUTNyKAzcLe2uOyttd5Cya9slcLeWYnaH0u2b1ZoC691WSMuhI9jHsa706kqU1ODya1o6yipxcZbGa3dZunj9MOoWS0xFO1zjjwvcVdlCnpVhOokt5eJ7ryjZd1PcHcHYgiriw29jiFrC4W/bz7yD3VB21V02Qis4xhQCgFAKAUAoBQCgFASXp1q4aJ1fYZ6a3a4s0Yw30CiPlLayApKqGRHVX4MSjlTwcKwG6isLELON/azt5b1q5HufWZFrXdtVjUW42Xc2rOzWN/BfWxJMN1AHEc6f3ZEDqrcWGxHJQdj3APaqcqU5UpunNZNPJ86JzGSnFSjsZ8rodhQHi9XunGQ6wY6bXGFniudZYm2JyVkIuM2Xs41LG7V+Xy1xGvISDYM0aLJ67CVhNNGscjQ/wDx3L1N+a+Lk5jQ4rh7qfx6W3evaavVPyNCgFAKAUAoBQCgFAKAzsHm8lp3K2+ZxFyYLq2bkjgAg9tirA9mUgkFT2IJBryrUadxTdKqs4vad6dSVKSnB5NGzuA1PitaYz4Q4ZIoY5H2uLOPn/QZW3PgnmWbjsDwYs3JR58gwWp8XwqrhdZwlri9j4/iTSyvIXkM1t3o9CtSZgoDyesOljr/AKS/jS0g55rp9ym9RfWlw88vygOygfI3EgbdmLMLo7erH2l2ieId4ru1m9U9nP8AFGkxm275TVaO1eo1aqxSLigFAKAUAoBQCgFAKAUBsZ0p1CM7oqxt5IYI58UGspGSRjJMoYukjqWPE8XEY4hVIiHYtyJrDSmyVrfd8gtU1n07/f0kuwiu61vwZPXHV0biX1GzaigO20u7qwuob6xuZba5tpFlhmico8bqd1ZWHcEEAgjuCKAgHWfovj8vYXfU7pdjPBhhAlz+n4eTtjmYgek24JLPasxA7ktEzBWJBR3sXR/SBXSVtdPKa2Pj+JF8SwzvL79RXm71xGvxBB2I2IqXGkFAKAUAoBQCgFAKAUBJdA65yeg8y9/ZtLJaXkQtchapMYxdW/NX4Ej2h0R13BAZFJB22rBxGwpYlQdCr0PifGZNpcytKiqRNjMVlMbncZBmcPdC4s7kHg+2zKw+cjr/AHXXcbr+sEEqVJqe/sK2HVnRrLme5rjRM7a4hdU1UgZVYR7mXiXsFyMC5eW8THTN4F/6GwE7Wsg4TKm5AJaNnXYnY77HsTXrRqyoVI1Y7U0+o6zgqkXB7Gasa+0pLobWmZ0lJdw3Yxd5Lbx3MDcoriMMeEqMOzIy7MCOxBFXNa3EbuhCvH6STIHXpOjUlTe48Csg8hQCgFAKAUAoBQCgFAWl0Hys8OWyOF8WFbe6t1uCrhebSRtxAVj63zZGJUeewJ+aNonpfb98s41ktcX2P45G7wOo41pQz1Ndv+Zl01XBKBQCgO20u7qwuob6xuZba5tpFlhmico8bqd1ZWHcEEAgjuCKAjfUXpHbdYcw+a0bZ2GI1VPbl7iwUiO3zV0Cd/R0VQsE7jY+H8yR+QTgWSIzTA9Je8RVtea1ulxc/JymixDCu+N1aG3evca1X1hfYu7lsMlZzWtzAxSSGZCjow8wQe4qexlGaUovNMjTTi8mdFdjgUAoBQCgFAKAUAoCUaD17k9DZJpoE9JsLnZbyzdiFlA32YH+7Iu5Kt7NyCCpZTr8Sw2jidF0qu3c96ZlWl1O0qKcdm9cZsXjcni85joMzhLz0qxud/CkICupHmkigng47brufMEEqVY1Tf2FbDqzo1lr3Pc1xomVvcQuYKpAyKwj3K5/CVx5ytpprXIht1m9G/EV6ySoZJGtgvgSvGoHhjwHjiBO/M27tuTy2sTRC777bztpPXF5rmfxIxjdDg1FVW8oqpeaMUAoBQCgFAKAUAoBQEy6RSBdfY5SN+azqO3l8kx/+K0WkuvC6n/X/wBI2WEvK7j0+pmxNVSTEUAoBQCgGpLHTuurKGx13glyj2lstrZ38Mno9/bRoriNBMARIgLIOMqOQkaohjHltsOxm6wx5UnnHiez4GHdWNG71zWvjIVN+Dx0uEriDqJqto9/VLYC2UkfrHpR2/zNSRaZ8dHtNS8C16pnD8njpn9YOqfuK295p5Zr0PaPET+uPyeOmf1g6p+4rb3mnlmvQ9o8RP64/J46Z/WDqn7itveaeWa9D2jxE/rj8njpn9YOqfuK295p5Zr0PaPET+uPyeOmf1g6p+4rb3mnlmvQ9o8RP64/J46Z/WDqn7itveaeWa9D2jxE/rj8njpn9YOqfuK295p5Zr0PaPET+uPyeOmf1g6p+4rb3mnlmvQ9o8RP64/J46Z/WDqn7itveaeWa9D2jxE/rns6e6Y6a0U73OntfakuxIwaWwucbDBb3BAZVLlZ3IK8mIIXf2dgTWtxbSGnilv3qVJJ7nxGZZYY7Spw+H0cfOe/UXNsedrLGzai6dak05Ek8r+AmWtooYEfee05MWdzsyItu90Tx33PHceTLvtG7rwbEIZ7Jan0/E12K0u+2sst2s1Vq1SGigFAKAUAoBQCgFAKAl/SX+0HFf8AP/6ElaLSX/a6v/X/ANI2OFfzkOn1M2MqqSZCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoDLxN8mPyMNzOk8lvuY7mKCcwvPbuCk0XPY8Q8bOh3BGzHcEdj3p1JUpqpHann1HWUVOLi9jNUNYaevdJarzGl8lA0F1ib6eymjYbFHjcqQf2EVddCrGvSjVjsaTIDUg6c3F7jyK9ToKAUAoBQCgFAKAUBL+kv9oOK/5/8A0JK0Wkv+11f+v/pGxwr+ch0+pmxlVSTIUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKApL8I4Pc9VMhqB7w3kmegt8ncXHhGMSXUkSm52Xio7TeIp4jjuDx7bGrZ0erd+w2m+LV1EMxSn3u6ly6+srGt0a8UAoBQCgFAKAUAoCX9Jf7QcV/z/8AoSVotJf9rq/9f/SNjhX85Dp9TNjKqkmQoBQCgFAKAyMdYXWVyFri7GMSXN5MlvChdUDO7BVBZiAO5HckAe2ulSpCjB1Kjyilm3xJbTmMXJqMdrLktumHS2G3jiv/AIT3FyigSyw5CCKN29rKht3Kg/mLNt+c1RdTu5W8ZuMbKTS398Wvl+aTynoHXcU511n+F9H0ty28e3JbDt+LXpD+jat+9rb3Suny50PsMv6i/ad/IOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LXpD+jat+9rb3Sny50PsMv6i/aPIOp6dfl+I+LTpGfm22rd/P/a1t7rRd3Oh9hl/UX7Th6B1ctVdfl+JTWZxsuGzF9h5xIJLG5ltnEkfBwyMVPJdzxO47jftV4WFxO7taVxUg4SnGMnF7YtpNxezWtj1IgtemqNWVOMuEk2s1seT2rnMOso8imfwg/8AbWB/9Mb/ANxJVnaKf7cudkSxn+Z6EVVUlNSKAUAoBQCgFAKAUBOujNrLPreGaNCy29vNI5BA4grx3O/n3YDt37/m3qP6UTUcMmnvaS60/YbPCE3dRa3Z+o2BqrCYCgFAKAUAoCxOkWFuEurrVzvPDFZo9nashZPFmlQrIN+JVlWFmDAMGBli8wTVZ91bHlg2Ayt4PKpX8xceW2T5ssk1/wAiTaJWPhuIqTWcafnPn+jy7c2uYnhO53NfJaWRcQoBQCgFAKAUAoBQGJmM/HpXGNnpLOK6MUiJDBNz8OWU7lVYr322VmI3XcIQCCQam/c90b8pcbp0akc6VPz58y2LavnPJateTz3Gg0kxPxZYylF+fLVHp39C1lFV9klLCgKa/CISS31HhbS4ieKeLFK7xyIVYLJI0kbbH2NG6OD5FWBHY1Z+iqaw5PlZEsZf/wCl8yKpqSGpFAKAUAoBQCgFAKAuLoHibIwZnNzPcreI0FrbKI1MLxNzaYs2+4YFYNgAQQz7kbDeFaZV8qdK3W9t9Wpetm/wKnnKdTi1df8A8LZqAkkFAKAUAoBQF74XDDTen7DBm3khuEjE96ssbxyekyAF1dGJ4sg4xEDjv4W5AJNfJHdVxxYxpDOjD5lBcBc6+d+rNcqSLf0QsXZ4cqk/nVHwuj6O5bsm+Jt62ZNVsSkUAoBQCgFAKAUByiieaRYo1LM5CgAbkk12hCVSShBZyepLjZxKSgnKTySK06m6mF/kvxBicsbjFWnhu/gykwT3QU8nA2HLhzaMH1h2ZlOz19gdzvRNaK4Uo1f9arlKfJq1R/65vpb3ZFMaSYv42u84/Mhmly8vT6iEVPiPnbaWl1f3UNjY20tzc3MixQwxIXeR2OyqqjuSSQAB3JNAa/8AXrKDJ9WdQQxZs5e2xU64e0vePET29qggjYLudlKxjYbnYbDergwah4NYUqeWTyzfO9pCL+p325nLlK/rZmGKAUAoBQCgFAKAUBs304xowvT7C45L28c3AlyVxbykeDDcTEDeIBiDygituTEKeSlSNlBNWaTXSucQlwdkUo9Wt9ry6CY4VRdG2We/X/nQSCo+bIUAoBQCgJl0lxtrf6yhusjiIMlY42Ca8uIJ3URkheERZSflFEzw7pseQ3BBXlUb0uxvydwaviC+dFeb+J6lz5Z55cSZssHsfGN7Tt3sb18y1v3FozSvPK80jFmdixJ8yT7a+JZzlVk6k3m283zsvSMVCKjHYjhXU7CgFAKAUAoBQADc7CmwHia41b8EsYLPF3xiz13wZfDG7WluVJMhbf5OVvU4diwUs/qkxsb37kuhLq1Fj2I02lFp0k97T+fx6slly8xXmmOORcXhtB555qfM/o9O/qKar6JK6FAd1xl7TR+lM7r++Yj8TQCHHqsnFpMnOGW224urDhxkn5AMvyAVh64ra4LYu/vYU9y1vmRh39wrahKW/YjT93eR2kkYszksxPmSfM1b3MQnafKHAoBQCgFAKAUAoD3dEaak1bqexwiv4cczl55N1BSFAWkYcmUFuKniu4LNso7kVi3t3Cxt5XE9iR729CVxVVOG82dVURQkaKiqNlVQAAPzADsBVMTnKpJzk829ZO4xUUorYj7XU5FAKAUAoC5+n+Fn09o5ZbiWZJ8+6XkkBJCrBGHWAspUHkQ8rggspSSMjbvXzp3asejWr0cFpP5nnz4s381PlS180iydB8PcITvZrbqXMtvbq6D2aoon4oBQCgFAKAUAA37CmwHiav1hBpGAW1ssU+Xnj5RxuAy2ysO0sg9reRRD59mYceKvcvc47nDxiUcVxaOVBfNi/p8r4ort5iEaTaTK0Ts7N+fvf1fj6inbi4nu55Lq6nkmmmcySSSMWZ2J3LEnuST3JNfTMYxhFRiskir5Scnm9pwrscGTjMbeZjJWmIx0Qlu76eO2gQuqBpHYKo5MQo3JHckAe00BS/X/AKkWmoshaaD0vdGTTmm3c+IHZlvsi6ItzdDcD1CY1SMcV+TjQkcyxNp6PYV4ut+HUX8SW3kW5e8h+J3nhVXgxfmoqOpAawUAoBQCgFAKAUAoC/OimmlwulpNQysReZ0lFCt8yzjfsDxkPz5VLFHQECGJlJD1X+l2Id8qxs4PVHW+d7OpevkJNglu4QdZ/S1Lmz9/qJ/UMN6KAUAoBQHraT09NqrUVlgopfBFy5M02ykwwopeWQKzKGKxq7cdwW22HcisW+vKOHW1S7rvKEE5PmSz6+LlPWjRncVI0qazcmkukvC7a2M3CxthbWsQEVvAHZxFEoCogLEk8VAG5JPbzr4bxjE6mM4hWxCpqdSTllxZvUugvmxtY2NtC3j9FJHTWtMoUAoBQCgFAco45JWCRozMTsABuSa5jFzkoRWbexLacNqKzewj+sNa2GlPSMVZMbjPQsqMpjVoLVvW5ByT60q7L8nxKgt6x3Rozeug/cnncd7xLHdUdqpZa3+Pi5tr5N8Ax7S6MFK2sNb2OW7o4+f1lQ3FxcXlxLd3c8k887tJLLIxZ3cncsxPckk7kmvoiEI04qEFklsRXDbbzZ112OBQEM6y9Q7rQdlLoTBSxwahvo3TMXUcpaawt2HH0MDYeFMw5eLsWYIyxngfGRpzozgikle3Mfwp+v3dZHsWv2n3ik+f3Gu9TojooBQCgFAKAUAoBQEr6baMfWeoVt5kBx1iEusjtcpDI1v4iKyxFt95G5gAKrEDdipVWI1uK4jDC7Z1pa3sS42ZVnbSuqqprpNj0HCGGAMxS3hjt4gzFuEcahEUE+xVVVA9gAFVFVqzrzdSo85PWybwioRUY7Efa8zsKAUAoBQFn9I8TFb4zJ6luLZWlldcfZyM0bBNgHnIUgur7GBQ44grJKvrbnane7JjrsMJhhtJ+dXev8Mdfa8snyNEz0Lw/wAIvHczWqmtXO/cvWTGvmEtUUAoBQCgABJ2A3pnkDjkJ7PD498rmLpLW2VHaPkRznK8QUiUkGRt3TcL5cgWKruwlejWheL6U1ErOm1T31JaorZnr3vWtSzeWvLI0+J45Z4VF99mnP6q278tW5anr2Fd6s6m3GRSbFaajlscfKkkE0sgQ3F1GX7E7A+CCgAKIx+c4Lup2H0rol3OcK0VyrL+LX+vJbPwrXwetvlSeRWGL6SXeLZw+ZD6q9r39hBasAjwoDutLK8yE3o1haTXMvB5PDhjLtwRS7tsO+yqrMT7ACT2FcpOTyW04bSWbIP1G6z2ug5jpzQE1pe6ggYm7zsb+LHYycSvhWex4O68iWuNm2dUMJHDxZJzgejMZRVxfLmj7/d1kfxDFWm6VB879xrxJI8sjSyuzu5LMzHcsT5kn2mpyR440OBQCgFAKAUAoBQGbhsPkM7kIsZjLZpp5jsFHkB7ST7APaa8bi4pWlJ1qzyij0pUp1pqEFm2bNaf0jidF2X4mxUsNz4ZAnvIuRW6kA2aVeaIwQncqrKCFIBG+9VLi2JVMUuHVk/N+iuJe/j92RNLK1jaUlBbd7PUrWGWKAUAoBQHbaWl1f3UNjY20tzc3MixQwxIXeR2OyqqjuSSQAB3JNAbANaJiLCw09C8TRYm2S13gkkeJpBu0roX9bi8rSP5D5/YAbAfGOn2PPSDHq1xGWdOL4EOLgx3rPjevnZdmjth4vw+FNrKT1vnfu2HVUNN4KAAE9gN6Z5A7IbaedxHDEzuxACqNySf1DvXelSqV5KFKLk3uSzOs5xprObyRi5XKYDT5kjzudtLaeIzo1qreNOJYtuUTRx8jG5J4jxOA337jixFhYP3LNI8WylOl3mPHU1P8uuXZkRy90sw201Rlw3xR19uztIblurwiVotLYZYZFlfje33GZigdWjZYNvDRtlYMrmVdn2GxAY3NgHciwTCJqveN3E1s4SyjuyfATefM24tPYQjENML+9h3ul/DT25PN/myXYk+Ur+/yOQyt017k764vLhlRGmnlaRyqqFUFmJOwVQB+YAD2VaVOnCjBU6aSilkktSSWxJbkiKylKcnKTzbMeu51FAZEyYrDWcWa1jmYcFh5B4guZwGmnjHiAm2g3D3BLQvGOPqB+Id4weQzbLDrm/nwaEW+Xcud/4zwr3NK2jwqjy9ZR3UfrjkdS2Z0xpCCXC6fMAhuhuvpWSYsju1xIo38PnGhSEHggRT6z85GsfCMAoYZFTn51Tj4uYi17iVS6fBjqjxe8q2t+awUAoBQCgFAKAUAoD08BprN6nvDZYXHy3LxqHlZVPCJOQXm7eSruwG59pA8zWPc3VGzpurXlkl/mo9aNGdeXAprNmxGjtFYXR2KghsoZHyMkW1/dSSBhLJzYjwxxBjQKUHEliWVm39YKtW4zjNXFavFBbF7Xy+rdvbmFjYws4ccntf+biQVpjOFAKAUAoBQGfgMguJzuOyrvKi2d3DcFogC4COG3UEjv27dx39tYOJ21S8sa1tRlwZzhKKfE2mk+h6z3takaNeFSazSabXGk9hZ7dT9DMxbw86Nz+iw/8A6188/Ihif2qHVL3FirTq2WrvUuw+DqdobkN485x3G+9pEe3t2+WFdo9w/EW1wrqGXIn7hLTuhl5tJ586ME9W8JDfyBNNXd1ZJKwiY3iQSyRb9iy+HIEYjzALAE+Z863lv3DbSEk7i8lJckFHt4T9Rg1NPKzjlTopPlefsR5OT6tZqdpUxGOssdEbjxYWK+PMkQ5bRsX+TfsV3YRqSVG3EEgyzD+5NozYS4UqUqr/AOcm8vy8HtzNPc6XYpcLJTUeZe/PsI/n9Zam1O8jZrLyzRyOkht41WG3DonBWWGMLGpCk9woPrMfMnee2eG2WHrK0oxp/hio+pI0Fa6r3P8ArTcudt+s8as08BQCgMj0SOCx/HOXv7TE4lZDG+Rv5PCgBDRhwvYtK6iVGMcSvJxPIKRWRbWle8nwKEXJ8nt4jyq1qdCPCqPJFXa1636etIlx+hbW5vrgA+Nkb1RFD3jX1YoBu3qP4m0jP6447xpsQZph+iMVlO9ln/xXtfuyNFdY235tuul+4qHUep9QauyRy+pMtcZC7MccIkmffhEihUjUeSoqqFVRsAAAKmVChStoKnRioxW5GiqVZ1pcKbzZ5dep5igFAKAUAoBQCgFATvR3SLUepokyWQRsRjZYBc21xdwyL6cnjeERb+rs+xWTdiQnyTjlyAU6TFMdtcMTi3wp/VXt4v8AMkzYWmG1rp57I8b9nGXnicBp3TllHjtOYhbKFAweRpWlnuTzYh5XPYuFYJ6iouyA8QSxNb4jiVfE6vfa72bFuXMSq1tadpDgQ6+Mza15kigFAKAUAoBQCgFAKAUAoBQHbaWl1f3UNjY20tzc3MixQwxIXeR2OyqqjuSSQAB3JNAefns1p7S1pJcah1FjbKUQPLHaeP4tzIyyeGYjFFyaJ/nMBKEBVd9+68ttZ4JfXuXe4NLjepf5zGFXxC3oLzpZviWsrjO/hBQWdxbtofAjxLfu11llSdZJBLyR1t9uCjgFVo5DKp9b2EAS2y0QoU/OupcJ8S1L3mmr43UlqpLLtKs1HqvUmrr4ZLUuau8jcLGkSNPKWEcaKFREHkqKoChRsAAAOwqVULelbQ73RiorkNNUqzrS4VR5s8mvY8xQCgFAPI7e2mTByWKV+yRO37FJocnOO1uZmKw28jkeYVSSK4bS2sZNnfaYbLX8nhWOMurh99uMULOd/wBgFdZThH5zS6TlQk9iM2PRerZZ57VNNZMzWyB54/RX5xqSACw23AJI/wAxXlO7t6UeHOokuNvUd40Ks3wYxbZIsF0a1hl5B6ZHb4uDZz4t3J5lV5BQiBn3O4UEgLue5GxI1d1pHh9qs+HwnxR19uztMyjhdzWeTjkuUtvTPTXRmkt3tbAZa82dPTclCr9iJV3jg7xx7o6Hv4jq8YZHWoXiOk15e+ZSfAjybel+7LpN7bYRRoPhT859nUSm5ubm9uZby8uJZ7id2llllcs8jsd2ZmPckkkkmo4bU66AUAoBQCgFAKAUAoBQCgFAKA7bRrVLqF76GWa2WRTNHFKI3dN/WVXKsFJG4BKsAe+x8qAjeosFqTPw3ONj17lcfibhwzY+0CxROFZynicdjKy+IwDPuQCQNh2qS2WOWtil3q1WfG3m+1Gqr4fVuH59V5cWXxIavQbEF+U2ob9wfPZEB/zINbJ6aT3UV+b4GL4hj9fs+JkDoRpcTIRlcqYgPXVnj5E/qYIAB+rY/trr5Z1cv9Fdb9w8Qw+u+o7sb0O0hDemTK3eUu7TlusUMyQyBfzFyjAn9fH/AIV1nplXa8ykk+fP2HaOBU0/OmzJuOimg/Tp5rIZZLVpWaGCe6jkZI9/VVnWNeRA2BIA3PfYeVYz0wv8vmx6n7z1WCW3G+te4z06WdP1WINpuNzGd2JuJgZB+ZuLjt+zavJ6WYjxrq+J3WD2y4+s9DI6A6cX0NrFbaBxmPe258pba4uy0++23MSTMvbY7cQPnHfftt4S0lxOT1VMuhe49FhVovodrOI0No8WrWY03j/Dbbc+AvPsd+z/ADh/wNeXlBiTeffX1L3HdYbarVwF2nu4qPHYXH3GMsNPYDwLmJoZDNhrSeTiw2PGSSNnQ7HsykEHuCDWPUxa+q/Oqy6Hl6j0hZW9PZBev1mPY47H4xg2Nsbe0I8jBEsZH+QFeMr+6n86rJ/9n7z0VvRjsgupHs4rUmosFcNd4PPZHHTud2ktLp4XJ/OSpBrxnXq1FlOTa5WzuqcIvNJGHd3d1f3U19fXMtzc3MjSzTSuXeR2O7MzHuSSSST3JNeR3OqgFAKAUAoBQCgFAKA//9k="
        const doc = new jsPDF()
        const finalY = doc.lastAutoTable.finalY || 10

        const namaProyek = `Perkembangan Proyek: ` + formData.namaProyek
        const today = new Date();
        const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        const dateTime = 'Tanggal: ' + date + ' ' + time

        doc.addImage(imgData, "JPEG", 180, 5, 20, 20);
        doc.text('PT.Saba Pratama Surabaya', 14, finalY)
        doc.text(namaProyek, 14, finalY + 15)
        doc.text(dateTime, 140, finalY + 25)

        doc.autoTable({
            startY: finalY + 30,
            html: '#Pelaporan',
            useCss: true,
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

    const groupPelaporan = _.groupBy(pelaporan, function (value) {
        return value.idSchedulingProyek.idRabProyek.idProyek.namaProyek;
    });

    const resultPelaporan = _.map(groupPelaporan, function (group) {
        return {
            namaProyek: group[0].idSchedulingProyek.idRabProyek.idProyek.namaProyek,
            total: _.sumBy(group, x => x.persentase).toFixed(0),
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

    const renderProyek = () => {
        return proyek.map(proyekq => {
            return resultPerYear.map(r1 => {
                if (proyekq.namaProyek === r1.namaProyek && r1.total === "100") {
                    console.log(proyekq.namaProyek)
                    return (
                        <option key={proyekq._id} value={proyekq.namaProyek} name={proyekq.namaProyek}>{proyekq.namaProyek}</option>
                    )
                }
            })
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
                                    <th>Tanggal Penyelesaian</th>
                                    <th>Status</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>{rendertablePelaporan()}</tbody>
                        </table>
                        <button type="button" class="btn btn-primary" onClick={() => exportPDFPELAPORAN()}>Download</button>
                    </div>

                    <div className="col-md-4" style={{ visibility: 'hidden', height: 0, width: 0 }}>
                        <h5>Tim RAB</h5>
                        <table className="table table-bordered" id="TeamRAB">
                            <thead>
                                <tr>
                                    <th>Nama Karyawan</th>
                                    <th>Work Hour /Hari</th>
                                </tr>
                            </thead>
                            <tbody>{rendertableTeamRAB()}</tbody>
                        </table>
                        <button type="button" class="btn btn-primary" onClick={() => exportPDFRAB()}>Download</button>
                    </div>

                </div>



            </div>
        </div >
    )
}

export default LaporanProyek