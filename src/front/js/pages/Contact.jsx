import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";


export const Contact = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const contacts = store.contacts;

    const handleEdit = (item) => {
        store.currentContact = item;
        navigate("/edit-contact");
    }

    const handleDelete = (item) => {
        actions.deleteContact(item);
    }

    return (
        <div className="container mt-4">
			<h1 className="text-center">Contacts</h1>
            <div className="d-flex justify-content-end">
                <button className="btn btn-secondary mb-4" onClick={() => navigate('/add-contact')}>Add a new contact</button>
            </div>
            {contacts.map((item, index) => (
                <div key={index} className="d-flex justify-content-between border p-4 mb-4">
                    <img className="me-5" style={{width: '170px'}} src="https://i.pinimg.com/564x/ca/db/dc/cadbdcfbe780c9d66f733ed071614f12.jpg" />
                    <div class="me-auto">
                        <p className="h4 my-3">{item.name}</p>
                        <p><i className="fas fa-phone me-2"></i> {item.phone}</p>
                        <p><i className="fas fa-envelope me-2"></i> {item.email}</p>
                        <p><i className="fas fa-map-marker-alt me-2"></i> {item.address}</p>
                    </div>
                    <div>
                        <i className="fas fa-edit me-3" onClick={() => handleEdit(item)}></i>
                        <i className="fas fa-trash-alt bin" onClick={() => handleDelete(item)}></i>
                    </div>
                </div>
            ))}
            <div className={`alert alert-danger text-center ${contacts.length == 0 ? '' : 'd-none' }`} role="alert">
                We don't have any contacts yet!
            </div>
        </div>
    );
}