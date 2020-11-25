import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import ModalSDB from './ModalSDB'
import hitsdb from '../../client/sumberdaya/sdbarang.get'
import postsdb from '../../client/sumberdaya/sdbarang.post'
import deletesdb from '../../client/sumberdaya/sdbarang.delete'

const SDB = () => {
    // Ini State GET SDB
    const [sdbData, setsdbData] = useState([])

    // State Post    
    const [formdata, setformData] = useState({})

    const handlerChange = (e) => {
        setformData(formdata => ({ ...formdata, [e.target.name]: e.target.value }));
    }

    const handlerSubmit = (e) => {
        e.preventDefault()
        if (formdata.namaBarang == null && formdata.satuan == null) {
            console.log('Error')
        } else {
            console.log('Success')
            postsdb(formdata)
            window.location = "/";
        }
    }

    // Delete Function
    const deleteRow = (id, e) => {
        deletesdb(id)
            .then(res => {
                const statesdb = sdbData.filter(_id => sdbData._id !== id);
                setsdbData(statesdb)
                console.log('Data telah dihapus')
                getData()
            })
    }

    // Get Data
    const getData = async () => {
        const sdb = await hitsdb()
        if (sdb.status === 200) {
            setsdbData(sdb.data)
        } else {
            console.log(sdb)
        }
    }

    // Useeffect untuk ambil data, dari client dimasukkan ke state diatas
    useEffect(() => {
        getData()
    }, [])

    // Iterate state untuk dimasukkan ke tabel
    const rendertable = () => {
        return sdbData.map(datasdb => {
            return (
                <tr key={datasdb._id}>
                    <td>{datasdb.namaBarang}</td>
                    <td>{datasdb.satuanBarang}</td>
                    <td>{datasdb.updated_at}</td>
                    <td><ModalSDB datasdb={datasdb} /> </td>
                    <td>
                        <button className="btn-sm btn-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete"
                            onClick={(e) => deleteRow(datasdb._id, e)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col-md-6">
                    <form onSubmit={handlerSubmit}>
                        <div className="form-group">
                            <h5>Input Data SDB</h5>
                            <label for="namaBarang">Nama Barang</label>
                            <input type="text" className="form-control" name="namaBarang" onInput={handlerChange.bind(this)} />
                        </div>
                        <div className="form-group">
                            <label for="satuan">Satuan</label>
                            <input type="text" className="form-control" name="satuan" onInput={handlerChange.bind(this)} />
                        </div>
                        <button type="submit" value="Add" className="btn btn-primary">Submit</button>
                    </form>
                </div>



                <div className="col-md-6">
                    <table className="table table-responsive-md" id="datasdb">
                        <thead>
                            <tr>
                                <th>Nama Barang</th>
                                <th>Satuan</th>
                                <th>Created at</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>{rendertable()} </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SDB