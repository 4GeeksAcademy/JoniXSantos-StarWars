import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from "../component/Spinner.jsx";

export const CharacterDetails = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    const character = store.characterDetails;

    useEffect(() => {
        actions.getCharacterDetails(id);
        return () => actions.clearCharacterDetails();
    }, [id]);

    const handleImgError = (event) => {
        event.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
    }
    
    return (
        <div className="container">
            {!character.name ? <Spinner /> : <div className="card my-4">
                <div className="row">
                    <div className="col-4">
                        <img src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`} onError={handleImgError} className="card-img-top" alt={`${character.name} image`} />
                    </div>
                    <div className="col-6">
                        <div className="card-body">
                            <h1 className="mb-5">{character.name}</h1>
                            <p className="card-text"><strong>Gender:</strong> {character.gender}</p>
                            <p className="card-text"><strong>Height:</strong> {character.height} m</p>
                            <p className="card-text"><strong>Mass:</strong> {character.mass} kg</p>
                            <p className="card-text"><strong>Skin Color:</strong> {character.skin_color}</p>
                            <p className="card-text"><strong>Hair Color:</strong> {character.hair_color}</p>
                            <p className="card-text"><strong>Eyes Color:</strong> {character.eye_color}</p>
                            <p className="card-text"><strong>Birth Year:</strong> {character.birth_year}</p>
                        </div>
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-secondary mt-4" onClick={() => navigate("/characters")}>Return to Characters</button>
                    </div>
                </div>
            </div>}
        </div>
    )
}