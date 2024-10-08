import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLogin = () => {
		if (store.isLogged) {
			actions.logout();
		} else {
			navigate('/login')
		}
	}

	return (
		<nav className="navbar navbar-expand bg-dark sticky-top">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand"><img style={{width: '100px'}} src="https://pngimg.com/uploads/star_wars_logo/star_wars_logo_PNG29.png"/></span>
				</Link>
				<div className="navbar-nav ms-auto" id="navbarNavDropdown">
				<ul className="navbar-nav">
					<li className="nav-item">
						<button type="button" className="btn btn-danger me-2" onClick={handleLogin}>
							{store.isLogged ? 'Logout' : 'Login'}
						</button>
					</li>
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
						<button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
							Favorites
							<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
								{store.favorites.length}
							</span>
						</button>
						<ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
							{store.favorites.length == 0 ? <li className="text-center">Nothing yet.</li> : ''}
							{store.favorites.map((item, index) => (
								<li key={index} className="dropdown-item d-flex justify-content-between align-items-baseline"><div><span className="text-warning" style={{fontSize: '12px'}}>{item.type}:</span> <span className="me-2">{item.name}</span></div> <button type="button" className="btn btn-outline-danger" onClick={() => actions.removeFromFavorites(item)}><i className="fas fa-trash-alt"></i></button></li>
							))}
						</ul>
					</li>
				</ul>
				</div>
			</div>
		</nav>
	);
};
