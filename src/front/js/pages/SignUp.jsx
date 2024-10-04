import React, { useState } from "react";

export const SignUp = () => {

    const [ firstName, setFirstName ] = useState()
    const [ lastName, setLastName ] = useState()
    const [ email, setEmail ] = useState()
    const [ password, setPassword ] = useState()
    const [ visible, setVisible ] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label for="inputFirstName" className="form-label">First Name</label>
                <input type="text" className="form-control" id="inputFirstName" value={firstName} />
            </div>
            <div className="mb-3">
                <label for="inputLastName" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="inputLastName" value={lastName} />
            </div>
            <div className="mb-3">
                <label for="inputEmail" className="form-label">Email address</label>
                <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" value={email} />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label for="inputPassword" className="form-label">Password</label>
                <input type={visible ? 'text' : 'password'} className="form-control" id="inputPassword" value={password} />
                {visible ?  <i className="fas fa-eye-slash" onClick={() => setVisible(false)}></i> : <i className="fas fa-eye" onClick={() => setVisible(true)}></i>}
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}