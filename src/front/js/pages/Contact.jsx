import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Link, Navigate, useNavigate } from "react-router-dom";


export const Contact = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const contacts = store.contacts;

    useEffect(() => {
        actions.getContacts();
    }, []);

    const handleEdit = (item) => {
        store.currentContact = item;
        navigate("/edit-contact");
    }

    const handleDelete = (item) => {
        actions.deleteContact(item);
    }

    return (
        <div className="container mt-4">
            <Link to="/add-contact">
				<button className="btn btn-success mb-4">Add a new contact</button>
			</Link>
            {contacts.map((item, index) => (
                <div key={index} className="d-flex col-12 border p-4 mb-4">
                    <img className="justify-content-start me-5" style={{width: '100px'}} src="https://upload.wikimedia.org/wikipedia/commons/9/93/Google_Contacts_icon.svg" />
                    <div className="justify-content-center col-10">
                        <h5>{item.name}</h5>
                        <p><i className="fas fa-phone"></i> {item.phone}</p>
                        <p><i className="fas fa-envelope"></i> {item.email}</p>
                        <p><i className="fas fa-map-marker-alt"></i> {item.address}</p>
                    </div>
                    <div className="justify-content-end">
                        <i className="fas fa-edit me-3" onClick={() => handleEdit(item)}></i>
                        <i className="fas fa-trash-alt" onClick={() => handleDelete(item)}></i>
                    </div>
                </div>
            ))}
            <div className={`alert alert-danger text-center ${contacts.length == 0 ? '' : 'd-none' }`} role="alert">
                We don't have any contact yet!
            </div>
        </div>
    );
}