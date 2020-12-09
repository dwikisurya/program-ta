import React from 'react'
import Logo from './Logo'

const Navbar = () => {
    return (
        <div>
            <Logo />
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Sumber Daya
                         </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="/sumberdaya/barang">Sumber Daya Barang</a>
                                <a className="dropdown-item" href="/sumberdaya/manusia">Sumber Daya Manusia</a>
                                <a className="dropdown-item" href="/sumberdaya/kegiatan">Kegiatan Proyek</a>
                                <a className="dropdown-item" href="/sumberdaya/kategori">Kategori Proyek</a>
                            </div>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Proyek
                         </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="/proyek">Proyek</a>
                                <a className="dropdown-item" href="/proyek/rab">RAB</a>
                                <a className="dropdown-item" href="/proyek/scheduling">Scheduling</a>
                            </div>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/pelaporan">Pelaporan</a>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Laporan
                         </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="/laporan/sumberdaya">Sumber Daya</a>
                                <a className="dropdown-item" href="/laporan/proyek">Sumber Daya Proyek</a>
                            </div>
                        </li>

                    </ul>

                </div>
            </nav>
        </div>
    )
}

export default Navbar