import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store } = useContext(Context);

	return (
		<div className="text-center" style={{background: "black"}}>
			<img src="https://img.hexus.net/v2/lifestyle/misc/starwars/starwarssaga-big.jpg" />
		</div>
	);
};
