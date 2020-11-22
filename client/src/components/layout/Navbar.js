import React from 'react'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'


const Navbar = () => {
    return (
        <div>
            <Nav
                activeKey="/"
                onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
            >
                <Nav.Item>
                    <Nav.Link href="/">Home</Nav.Link>
                </Nav.Item>
                <NavDropdown title="Sumber Daya" id="nav-dropdown">
                    <NavDropdown.Item eventKey="4.1">Sumber Daya Barang</NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.2">Sumber Daya Manusia</NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.3">Kategori Proyek</NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.3">Kegiatan Proyek</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Proyek" id="nav-dropdown">
                    <NavDropdown.Item eventKey="4.1">Proyek</NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.2">RAB</NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.3">Scheduling</NavDropdown.Item>
                </NavDropdown>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Pelaporan Lapangan</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Laporan</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default Navbar