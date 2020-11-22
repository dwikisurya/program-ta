import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/layout/Dashboard';
import SDB from './components/layout/SumberDaya/SDB';

ReactDOM.render(
  <React.StrictMode>
    <SDB />
  </React.StrictMode>,
  document.getElementById('root')
);

