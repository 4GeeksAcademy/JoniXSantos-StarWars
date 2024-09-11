import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	return (
		<nav className="navbar navbar-expand bg-dark sticky-top">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand"><img style={{width: '100px'}} src="https://pngimg.com/uploads/star_wars_logo/star_wars_logo_PNG29.png"/></span>
				</Link>
				<div className="navbar-nav ms-auto" id="navbarNavDropdown">
				<ul className="navbar-nav">
					<li className="nav-item">
						<Link className="nav-link text-light" to="/characters">
							Characters
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-light" to="/planets">
							Planets
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-light" to="/starships">
							Starships
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-light" to="/contact-list">
							Contacts
						</Link>
					</li>
					<li className="nav-item dropdown">
						<button type="button" className="nav-li dropdown-toggle text-light btn btn-secondary position-relative" data-bs-toggle="dropdown" aria-expanded="false">
							Favorites
							<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
								{store.favorites.length}
							</span>
						</button>
						<ul className="dropdown-menu dropdown-menu-end p-2">
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
