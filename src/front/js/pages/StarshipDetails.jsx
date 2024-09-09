import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from "../component/Spinner.jsx";

export const StarshipDetails = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    const starship = store.starshipDetails;

    useEffect(() => {
        actions.clearStarshipDetails();
        actions.getStarshipDetails(id);
    }, [id]);

    const handleImgError = (event) => {
        event.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
    }
    
    return (
        <div className="container">
            {!starship ? <Spinner /> : <div className="card my-4">
                <div className="row">
                    <div className="col-4">
                        <img src={`https://starwars-visualguide.com/assets/img/starships/${id}.jpg`} onError={handleImgError} className="card-img-top" alt={`${starship.name} image`} />
                    </div>
                    <div className="col-6">
                        <div className="card-body">
                            <h1 className="mb-4">{starship.name}</h1>
                            <p className="card-text"><strong>Model:</strong> {starship.model}</p>
                            <p className="card-text"><strong>Starship Class:</strong> {starship.starship_class}</p>
                            <p className="card-text"><strong>Manufacturer:</strong> {starship.manufacturer}</p>
                            <p className="card-text"><strong>Cost in Credits:</strong> {starship.cost_in_credits}</p>
                            <p className="card-text"><strong>Length:</strong> {starship.length}</p>
                            <p className="card-text"><strong>Crew:</strong> {starship.crew}</p>
                            <p className="card-text"><strong>Passengers:</strong> {starship.passengers}</p>
                            <p className="card-text"><strong>Max Atmosphering Speed:</strong> {starship.max_atmosphering_speed}</p>
                            <p className="card-text"><strong>Hyperdrive Rating:</strong> {starship.hyperdrive_rating}</p>
                            <p className="card-text"><strong>MGLT:</strong> {starship.MGLT}</p>
                            <p className="card-text"><strong>Cargo Capacity:</strong> {starship.cargo_capacity}</p>
                            <p className="card-text"><strong>Consumables:</strong> {starship.consumables}</p>
                        </div>
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-secondary mt-4" onClick={() => navigate("/starships")}>Return to Starships</button>
                    </div>
                </div>
            </div>}
        </div>
    )
}