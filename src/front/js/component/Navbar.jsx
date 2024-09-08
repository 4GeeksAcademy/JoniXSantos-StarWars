import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	return (
		<nav className="navbar navbar-expand-lg bg-dark">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1"><img style={{width: '100px'}} src="https://pngimg.com/uploads/star_wars_logo/star_wars_logo_PNG29.png"/></span>
				</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse d-flex justify-content-end" id="navbarNavDropdown">
				<ul className="navbar-nav">
					<Link className="nav-link text-light" to="/characters">
						Characters
					</Link>
					<Link className="nav-link text-light" to="/planets">
						Planets
					</Link>
					<Link className="nav-link text-light" to="/starships">
						Starships
					</Link>
					<Link className="nav-link text-light" to="/contact-list">
						Contacts
					</Link>
					<li className="nav-item dropdown">
						<button type="button" className="nav-link dropdown-toggle text-light btn btn-secondary position-relative" data-bs-toggle="dropdown" aria-expanded="false">
							Favorites
							<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
								{store.favorites.length}
							</span>
						</button>
						<ul className="dropdown-menu">
							{store.favorites.length == 0 ? <li className="text-center">Nothing yet.</li> : ''}
							{store.favorites.map((item, index) => (
								<li key={index} className="text-center">{item.name} <i className="fas fa-trash-alt" onClick={() => actions.removeFromFavorites(item)}></i></li>
							))}
						</ul>
					</li>
				</ul>
				</div>
			</div>
		</nav>
	);
};
