import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../component/Spinner.jsx";

export const Planets = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const planets = store.planets;

    const handleImgError = (event) => {
        event.target.src = "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
    }

    return (
        <div className="container">
            <h1 className="text-center my-4">Planets</h1>
            {planets.length === 0 ? <Spinner /> : <div className="d-flex justify-content-center row row-cols-1 row-cols-md-2 g-4 mb-5">
            {planets.map((item, index) => (
                <div key={index} className="card mx-3" style={{width: '18rem'}}>
                    <img src={`https://starwars-visualguide.com/assets/img/planets/${item.uid}.jpg`} onError={handleImgError} className="card-img-top" alt={`${item.name} image`} />
                    <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                    </div>
                    <div className="card-body d-flex justify-content-between">
                        <button className="btn btn-secondary" onClick={() => navigate(`/planets/${item.uid}`)}>Details</button>
                        <button className={`btn ${!store.favorites.map(fav => fav.name).includes(item.name) ? 'btn-outline-danger' : 'btn-danger'}`} onClick={!store.favorites.map(fav => fav.name).includes(item.name) ? () => actions.addToFavorites({...item, type: "Planet"}) : () => actions.removeFromFavorites(item)}><strong>♡</strong></button>
                    </div>
                </div> 
            ))}
            </div>}
        </div>   
    );
}