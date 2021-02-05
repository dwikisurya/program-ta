import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import jwt from 'jsonwebtoken'
import Login from './components/auth/SignIn'
import Pagenotfound from './components/layout/pagenotfound'

import Dashboard from './components/layout/Dashboard';

import SDB from './components/layout/SumberDaya/SDB'
import SDM from './components/layout/SumberDaya/SDM'
import Kegiatan from './components/layout/SumberDaya/KegiatanProyek'
import Kategori from './components/layout/SumberDaya/KategoriProyek'
import RoleBiaya from './components/layout/SumberDaya/BiayaRole'

import RAB from './components/layout/Proyek/RAB'
import Proyek from './components/layout/Proyek/Proyek'
import Scheduling from './components/layout/Proyek/Scheduling'

import PelaporanLapangan from './components/layout/Proyek/PelaporanLapangan'

import MonitoringProyek from './components/layout/Proyek/MonitoringProyek'

import LaporanSumberDaya from './components/layout/Laporan/LaporanSumberdaya'
import LaporanProyek from './components/layout/Laporan/LaporanProyek'

const token = localStorage.getItem('token') || null
let decode = null
if (token) {
  decode = jwt.verify(token, process.env.REACT_APP_SECRET)
  localStorage.setItem('role', decode.role)
  localStorage.setItem('namaUser', decode.namaUser)
}

function mappingRouting() {
  switch (decode.role) {
    case 'administrasi':
      return <Switch>
        <Route exact path="/"><Dashboard /></Route>
        <Route exact path="/sumberdaya/barang"><SDB /></Route>
        <Route exact path="/sumberdaya/manusia"><SDM /></Route>
        <Route exact path="/sumberdaya/kegiatan"><Kegiatan /></Route>
        <Route exact path="/sumberdaya/kategori"><Kategori /></Route>
        <Route exact path="/sumberdaya/biayarole"><RoleBiaya /></Route>
        <Route exact path="/laporan/sumberdaya"><LaporanSumberDaya /></Route>
        <Route path=""><Pagenotfound /></Route>
      </Switch>

    case 'pm':
      return <Switch>
        <Route exact path="/"><Dashboard /></Route>
        <Route exact path="/laporan/proyek"><LaporanProyek /></Route>
        <Route exact path="/proyek/rab"><RAB /></Route>
        <Route exact path="/proyek/scheduling"><Scheduling /></Route>
        <Route exact path="/monitoringproyek"><MonitoringProyek /></Route>
        <Route path=""><Pagenotfound /></Route>
      </Switch>

    case 'mandor':
      return <Switch>
        <Route exact path="/"><Dashboard /></Route>
        <Route exact path="/pelaporan"><PelaporanLapangan /></Route>
        <Route path=""><Pagenotfound /></Route>
      </Switch>

    case 'direktur':
      return <Switch>
        <Route exact path="/"><Dashboard /></Route>
        <Route exact path="/proyek"><Proyek /></Route>
        <Route exact path="/proyek/rab"><RAB /></Route>
        <Route exact path="/proyek/scheduling"><Scheduling /></Route>
        <Route exact path="/monitoringproyek"><MonitoringProyek /></Route>
        <Route exact path="/laporan/sumberdaya"><LaporanSumberDaya /></Route>
        <Route exact path="/laporan/proyek"><LaporanProyek /></Route>
        <Route path=""><Pagenotfound /></Route>
      </Switch>

    default:
      return <Switch>
        <Route path=""><Pagenotfound /></Route>
      </Switch>
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      {
        // Kalau token tidak ada cmn menampilkan halaman login
        // Harus Login untuk dapat token
        !token ?
          <Switch>
            <Route exact path="/login"><Login /></Route>
            <Route path=""><Redirect to="/login"></Redirect></Route>
          </Switch>

          // Kalau dapat token berarti sudah login
          // Menampilkan halaman lainnya
          :
          mappingRouting()
      }

    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

