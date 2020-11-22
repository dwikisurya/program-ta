import React from 'react'
import logo from '../logoP.png'

const SignIn = () => {
    return (
        <div class="container-fluid">
            <div class="row d-flex align-items-center min-vh-100">
                <div class="col-md-8" style={{ background: 'lightblue', display: 'block' }}>
                </div>
                <div class="col-md-4" style={{ background: 'white', display: 'block' }}>
                    <center><img src={logo} sizes='100%'></img></center>
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1">
                                Username
					    </label>
                            <input type="email" class="form-control" id="exampleInputEmail1" />
                        </div>
                        <div class="form-group">

                            <label for="exampleInputPassword1">
                                Password
					</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" />
                        </div>
                        <button type="submit" class="btn btn-primary">
                            Submit
				</button>
                    </form>
                </div>
            </div>
        </div >
    )

}

export default SignIn