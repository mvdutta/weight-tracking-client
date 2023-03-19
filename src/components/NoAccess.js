import React from "react"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "./nav/NavBar"

export const NoAccess = () => {
    return (
        <div>
            <NavBar />
            <h1>You do not have access to this resource</h1>
        </div>
    )
}

