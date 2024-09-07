import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";

export const Starships = () => {
    const { store, actions } = useContext(Context);
    const starships = store.starships;

    useEffect(() => {
        actions.getStarships();
    }, []);

    const handleImgError = (event) => {
        event.target.src = "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
    }

    return (
        <div className="container">
            <h1 className="text-center my-4">Starships</h1>
            <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
            {starships.map((item, index) => (
                <div key={index} className="card ms-3 me-4" style={{width: '18rem'}}>
                    <img src={`https://starwars-visualguide.com/assets/img/starships/${item.uid}.jpg`} onError={handleImgError} className="card-img-top" alt="Not found" />
                    <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                    </div>
                    <div className="card-body d-flex justify-content-between">
                        <button className="btn btn-secondary">Details</button>
                        <button className="btn btn-outline-danger"><strong>♡</strong></button>
                    </div>
                </div> 
            ))};
            </div>
        </div>   
    );
}