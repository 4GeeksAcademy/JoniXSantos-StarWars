import React, { useContext } from "react";
import { Context } from "../store/appContext.js";

export const Contact = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="alert alert-danger text-center" role="alert">
            We don't have any contact yet!
        </div>
    );
}