import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
//Custom components
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
//Custom pages/views
import { Home } from "./pages/Home.jsx";
import { Demo } from "./pages/Demo.jsx";
import { Single } from "./pages/Single.jsx";
import { Characters } from "./pages/Characters.jsx";
import { CharacterDetails } from "./pages/CharacterDetails.jsx";
import { Planets } from "./pages/Planets.jsx";
import { PlanetDetails } from "./pages/PlanetDetails.jsx";
import { Starships } from "./pages/Starships.jsx";
import { StarshipDetails } from "./pages/StarshipDetails.jsx";
import { Contact } from "./pages/Contact.jsx";
import { AddContact } from "./pages/AddContact.jsx";
import { EditContact } from "./pages/EditContact.jsx";
import { SignUp } from "./pages/SignUp.jsx";
import { Login } from "./pages/Login.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Characters />} path="/characters" />
                        <Route element={<CharacterDetails />} path="/characters/:id" />
                        <Route element={<Planets />} path="/planets" />
                        <Route element={<PlanetDetails />} path="/planets/:id" />
                        <Route element={<Starships />} path="/starships" />
                        <Route element={<StarshipDetails />} path="/starships/:id" />
                        <Route element={<Contact />} path="/contact-list" />
                        <Route element={<AddContact />} path="/add-contact" />
                        <Route element={<EditContact />} path="/edit-contact" />
                        <Route element={<SignUp />} path="/sign-up" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
