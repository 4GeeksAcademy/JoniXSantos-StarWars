import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const { actions } = useContext(Context);
    const [ first_name, setFirstName ] = useState('');
    const [ last_name, setLastName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ visible, setVisible ] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault()
        const dataToSend = { first_name, last_name, email, password }
        actions.signUp(dataToSend)
        alert('Congratulations! The account was successfully created!')
        navigate('/login')
    }

    return (
        <div className="container col-lg-4 col-md-6 col-sm-8 needs-validation" novalidate>
            <form onSubmit={handleSubmit}>
                <h1 className="text-center my-4">Sign Up</h1>
                <div className="mb-3">
                    <label htmlFor="inputFirstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="inputFirstName" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputLastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="inputLastName" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email address*</label>
                    <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3" style={{ position: 'relative' }}>
                    <label htmlFor="inputPassword" className="form-label">Password*</label>
                    <input type={visible ? 'text' : 'password'} className="form-control" id="inputPassword" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div style={{ position: 'absolute', right: '20px', top: '72%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setVisible(!visible)}>
                        {visible ?  <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                    </div>
                </div>
                <button className="btn btn-secondary w-100 py-2" type="submit">Submit</button>
                <span className="text-secondary" style={{fontSize: '12px'}}>* This data is required to register</span>
            </form>
        </div>
    )
}