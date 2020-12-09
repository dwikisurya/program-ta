import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Dashboard from './components/layout/Dashboard';

import SDB from './components/layout/SumberDaya/SDB'
import SDM from './components/layout/SumberDaya/SDM'
import Kegiatan from './components/layout/SumberDaya/KegiatanProyek'
import Kategori from './components/layout/SumberDaya/KategoriProyek'

import RAB from './components/layout/Proyek/RAB'
import Proyek from './components/layout/Proyek/Proyek'
import Scheduling from './components/layout/Proyek/Scheduling'

import PelaporanLapangan from './components/layout/Proyek/PelaporanLapangan'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/"><Dashboard /></Route>

        <Route exact path="/sumberdaya/barang"><SDB /></Route>
        <Route exact path="/sumberdaya/manusia"><SDM /></Route>
        <Route exact path="/sumberdaya/kegiatan"><Kegiatan /></Route>
        <Route exact path="/sumberdaya/kategori"><Kategori /></Route>

        <Route exact path="/proyek"><Proyek /></Route>
        <Route exact path="/proyek/rab"><RAB /></Route>
        <Route exact path="/proyek/scheduling"><Scheduling /></Route>

        <Route exact path="/pelaporan"><PelaporanLapangan /></Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

