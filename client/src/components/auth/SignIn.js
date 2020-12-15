import React, { useState } from 'react'
import Swal from 'sweetalert2'

import postlogin from '.././client/login.post'

const SignIn = () => {

    const [formdata, setFormData] = useState([])

    function validateForm() {
        return formdata.length > 0;
    }

    const handleSubmit = (e) => {
        setFormData(formdata => ({ ...formdata, [e.target.name]: e.target.value }));
    }

    const handlerSubmit = async (e) => {
        try {
            e.preventDefault()
            const result = await postlogin(formdata)
            if (result.status === 200) {
                const { token } = result.data
                localStorage.setItem('token', token)
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Signed in successfully'
                }).then(res => {
                    window.location = '/'
                })
                return
            } else {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Email/Password Salah',
                })
            }
        } catch (error) {

        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                        <div className="card-body">
                            <h5 className="card-title text-center">Sign In</h5>
                            <form onSubmit={handlerSubmit}>
                                <div className="form-label-group">
                                    <label htmlFor="inputEmail">Email address</label>
                                    <input type="email" name="email" class="form-control" placeholder="Email address" required autofocus onChange={handleSubmit.bind(this)} />
                                </div>

                                <div className="form-label-group">
                                    <label htmlFor="inputPassword">Password</label>
                                    <input type="password" name="password" class="form-control" placeholder="Password" required onChange={handleSubmit.bind(this)} />
                                </div>
                                <br />
                                <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign in</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SignIn