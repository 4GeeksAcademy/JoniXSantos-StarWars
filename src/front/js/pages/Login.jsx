import React, { useState } from "react";

export const Login = () => {
    const [ email, setEmail ] = useState()
    const [ password, setPassword ] = useState()
    const [ visible, setVisible ] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal">Please login</h1>
            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label for="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input type={visible ? 'text' : 'password'} className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {visible ?  <i className="fas fa-eye-slash" onClick={() => setVisible(false)}></i> : <i className="fas fa-eye" onClick={() => setVisible(true)}></i>} 
                <label for="floatingPassword">Password</label>
            </div>
            <div className="form-check text-start my-3">
                <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                <label className="form-check-label" for="flexCheckDefault">
                Remember me
            </label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
            <p className="mt-5 mb-3 text-body-secondary">© 2024</p>
        </form>
    )
}