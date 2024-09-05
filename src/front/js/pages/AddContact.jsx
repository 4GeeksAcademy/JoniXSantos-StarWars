import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";

export const AddContact = () => {
    const { store, actions } = useContext(Context);
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState();
    const [ address, setAddress ] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <>
            <h1 className="text-center mb-4">Add a new contact</h1>
            <div className="container d-flex justify-content-center">
                <form onSubmit={handleSubmit} className="col-6">
                <div className="mb-3">
                    <label for="full-name" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="full-name" />
                </div>
                <div className="mb-3">
                    <label for="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" />
                </div>
                <div className="mb-3">
                    <label for="phone" className="form-label">Phone</label>
                    <input type="number" className="form-control" id="phone" />
                </div>
                <div className="mb-3">
                    <label for="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" />
                </div>
                <div className="d-flex justify-content-center">
                    <button type="button" class="btn btn-primary col-2 me-3">Save</button>
                    <button type="button" class="btn btn-secondary col-2">Cancel</button>
                </div>
                </form> 
            </div>
        </>
        
        
    )
}