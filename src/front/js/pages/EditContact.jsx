import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const EditContact = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const contact = store.currentContact;
    const [ name, setName ] = useState(contact.name);
    const [ phone, setPhone ] = useState(contact.phone);
    const [ email, setEmail ] = useState(contact.email);
    const [ address, setAddress ] = useState(contact.address);

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = {
            name: name,
            phone: phone,
            email: email,
            address: address
        }
        actions.editContact(contact, dataToSend);
        navigate("/contact-list");
    }

    const handleReset = () => {
        navigate("/contact-list");
    }

    return (
        <>
            <h1 className="text-center mt-4 mb-4">Edit this contact</h1>
            <div className="container d-flex justify-content-center">
                <form onSubmit={handleSubmit} className="col-6">
                <div className="mb-3">
                    <label htmlFor="full-name" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="full-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="number" className="form-control" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="d-flex justify-content-center mb-5">
                    <button type="submit" className="btn btn-primary col-2 me-3">Save</button>
                    <button type="reset" onClick={handleReset} className="btn btn-secondary col-2">Cancel</button>
                </div>
                </form> 
            </div>
        </>
        
        
    )
}