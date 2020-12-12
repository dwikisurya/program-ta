import React from 'react'
import Gambar from '../logoP.png'

const Logo = () => {
    const roleUser = localStorage.getItem('role') || null
    return (

        <img src={Gambar} width="50" height="50" alt="Logo"></img>

    )
}

export default Logo