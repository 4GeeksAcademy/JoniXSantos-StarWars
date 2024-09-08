import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useParams } from 'react-router-dom';

export const PlanetDetails = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const planet = store.planetDetails;

    useEffect(() => {
        actions.getPlanetDetails(id);
    }, [id]);

    const handleImgError = (event) => {
        event.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
    }
    
    return (
        <div className="container">
            <div className="card my-4">
                <div className="row">
                    <div className="col-4">
                        <img src={`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`} onError={handleImgError} className="card-img-top" alt={`${planet.name} image`} />
                    </div>
                    <div className="col-8">
                        <div className="card-body">
                            <h1 className="mb-4">{planet.name}</h1>
                            <p className="card-text"><strong>Diameter:</strong> {planet.diameter}</p>
                            <p className="card-text"><strong>Rotation Period:</strong> {planet.rotation_period}</p>
                            <p className="card-text"><strong>Orbital Period:</strong> {planet.orbital_period}</p>
                            <p className="card-text"><strong>Gravity:</strong> {planet.gravity}</p>
                            <p className="card-text"><strong>Population:</strong> {planet.population}</p>
                            <p className="card-text"><strong>Climate:</strong> {planet.climate}</p>
                            <p className="card-text"><strong>Terrain:</strong> {planet.terrain}</p>
                            <p className="card-text"><strong>Surface Water:</strong> {planet.surface_water}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}