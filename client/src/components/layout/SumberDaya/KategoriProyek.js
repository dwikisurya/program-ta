import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'

import ModalKategoriProyek from './ModalKategoriProyek'

import hitkategori from '../../client/sumberdaya/kategoriproyek.get'
import postkategori from '../../client/sumberdaya/kategoriproyek.post'
import deletekategori from '../../client/sumberdaya/kategoriproyek.delete'

const KategoriProyek = () => {
    // State Get
    const [kategoriProyek, setkategoriData] = useState([])

    const getData = async () => {
        const kategori = await hitkategori()
        if (kategori.status === 200) {
            setkategoriData(kategori.data)
        } else {
            console.log(kategori)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const rendertable = () => {
        return kategoriProyek.map(kategori => {
            return (
                <tr key={kategori._id}>
                    <td>{kategori.namaKategori}</td>
                    <td>{kategori.deskripsiKategori}</td>
                    <td><ModalKategoriProyek datakategori={kategori} /></td>
                    <td>
                        <button className="btn-sm btn-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete"
                            onClick={(e) => deleteRow(kategori._id, e)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    // State Post
    const [formdata, setformData] = useState({})

    const handlerChange = (e) => {
        setformData(formdata => ({ ...formdata, [e.target.name]: e.target.value }))
    }

    const handlerSubmit = (e) => {
        e.preventDefault()
        if (formdata !== null) {
            console.log('Success')
            console.log(formdata)
            postkategori(formdata)
            window.location = "/"
        } else {
            console.log('Error')
        }
    }

    // Delete Function
    const deleteRow = (id, e) => {
        deletekategori(id)
            .then(res => {
                const statekategori = kategoriProyek.filter(_id => kategoriProyek._id !== id);
                setkategoriData(statekategori)
                console.log('Data telah dihapus')
                getData()
            })
    }

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form onSubmit={handlerSubmit}>
                        <div className="form-group">
                            <h5>Input Data Kategori Proyek</h5>
                            <label for="inp_kategoriproyek">Kategori Proyek</label>
                            <input type="text" className="form-control" name="namaKategori" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="inp_deskripsikategori">Deskripsi Kategori</label>
                            <input type="text" className="form-control" name="deskripsiKategori" onInput={handlerChange.bind(this)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                <div className="col-md-6">
                    <table className="table table-responsive-md" id="kategoriProyek">
                        <thead>
                            <tr>
                                <th>Nama Kategori</th>
                                <th>Deskripsi Kategori</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>{rendertable()}</tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default KategoriProyek