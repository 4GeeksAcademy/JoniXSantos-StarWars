import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from 'react-router-dom';
import { Spinner } from "../component/Spinner.jsx";

export const Characters = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const characters = store.characters;

    const handleImgError = (event) => {
        event.target.src = "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
    }

    return (
        <div className="container">
            <h1 className="text-center my-4">Characters</h1>
            {characters.length === 0 ? <Spinner /> : <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
            {characters.map((item, index) => (
                <div key={index} className="card ms-3 me-4" style={{width: '18rem'}}>
                    <img src={`https://starwars-visualguide.com/assets/img/characters/${item.uid}.jpg`} onError={handleImgError} className="card-img-top" alt={`${item.name} image`} />
                    <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                    </div>
                    <div className="card-body d-flex justify-content-between">
                        <button className="btn btn-secondary" onClick={() => navigate(`/characters/${item.uid}`)}>Details</button>
                        <button className="btn btn-outline-danger" onClick={() => actions.addToFavorites(item)}><strong>♡</strong></button>
                    </div>
                </div> 
            ))}
            </div>}
        </div>   
    );
}