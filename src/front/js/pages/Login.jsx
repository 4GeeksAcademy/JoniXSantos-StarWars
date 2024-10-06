import React, { useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const { actions } = useContext(Context);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ visible, setVisible ] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = { email, password };
        actions.login(dataToSend);
        alert(`Welcome, ${email}`)
        navigate('/')
    }

    return (
        <div className="container col-lg-4 col-md-6 col-sm-8">
            <form onSubmit={handleSubmit}>
                <h1 className="text-center my-4">Login</h1>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input type={visible ? 'text' : 'password'} className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="floatingPassword">Password</label>
                    <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setVisible(!visible)}>
                        {visible ?  <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                    </div>
                </div>
                <button className="btn btn-secondary w-100 py-2" type="submit">Enter</button>
                <p className="text-center mt-3">No account? Please, <Link to='/sign-up'>sign up</Link>!</p>
            </form>
        </div>
    )
}