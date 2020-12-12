import React from 'react'
import Logo from './Logo'

const Navbar = () => {
    const role = localStorage.getItem('role') || null

    return (
        <div>
            <Logo />
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                        </li>
                        {
                            role === "administrasi" &&
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Sumber Daya </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" href="/sumberdaya/barang">Sumber Daya Barang</a>
                                    <a className="dropdown-item" href="/sumberdaya/manusia">Sumber Daya Manusia</a>
                                    <a className="dropdown-item" href="/sumberdaya/kegiatan">Kegiatan Proyek</a>
                                    <a className="dropdown-item" href="/sumberdaya/kategori">Kategori Proyek</a>
                                </div>
                            </li>
                        }
                        {
                            (role === "pm" ||
                                role === "direktur")
                            &&
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Proyek</a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {role === "direktur" &&
                                        <a className="dropdown-item" href="/proyek">Proyek</a>
                                    }
                                    <a className="dropdown-item" href="/proyek/rab">RAB</a>
                                    <a className="dropdown-item" href="/proyek/scheduling">Scheduling</a>
                                </div>
                            </li>
                        }
                        {
                            role === "mandor" &&
                            <li className="nav-item">
                                <a className="nav-link" href="/pelaporan">Pelaporan</a>
                            </li>

                        }

                        {
                            (role === "administrasi" ||
                                role === "direktur" ||
                                role === "pm")
                            &&
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Laporan </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {(role === "administrasi" || role === "direktur") &&
                                        <a className="dropdown-item" href="/laporan/sumberdaya">Sumber Daya</a>
                                    }
                                    {(role === "pm" || role === "direktur") &&
                                        <a className="dropdown-item" href="/laporan/proyek">Sumber Daya Proyek</a>}
                                </div>
                            </li>
                        }
                    </ul>
                    <div className="nav navbar-nav navbar-right">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Account </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="nav-link">{`Halo, ` + role}</a>
                                <a className="nav-link" href="#" onClick={function () {
                                    localStorage.clear()
                                    window.location = '/login'
                                }}>Log Out</a>
                            </div>

                        </li>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar