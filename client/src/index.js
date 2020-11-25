import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route } from 'react-router-dom'

import SDB from './components/layout/SumberDaya/SDB'
import SDM from './components/layout/SumberDaya/SDM'
import KategoriProyek from './components/layout/SumberDaya/KategoriProyek'
import KegiatanProyek from './components/layout/SumberDaya/KegiatanProyek'
import Dashboard from './components/layout/Dashboard'

ReactDOM.render(
  <React.StrictMode>
    <KegiatanProyek />
  </React.StrictMode>,
  document.getElementById('root')
);

