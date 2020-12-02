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
                                <a className="dropdown-item" href="#">Sumber Daya Barang</a>
                                <a className="dropdown-item" href="#">Sumber Daya Manusia</a>
                                <a className="dropdown-item" href="#">Kegiatan Proyek</a>
                                <a className="dropdown-item" href="#">Kategori Proyek</a>
                            </div>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Proyek
                         </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#">Proyek</a>
                                <a className="dropdown-item" href="#">RAB</a>
                                <a className="dropdown-item" href="#">Scheduling</a>
                            </div>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/">Pelaporan <span className="sr-only">(current)</span></a>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Laporan
                         </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#">Sumber Daya</a>
                                <a className="dropdown-item" href="#">Sumber Daya Proyek</a>
                            </div>
                        </li>

                    </ul>

                </div>
            </nav>
        </div>
    )
}

export default Navbar