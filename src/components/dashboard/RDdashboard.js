import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../nav/NavBar";

const RDdashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("wt_token");
    if (user) {
      setName(JSON.parse(user).name);
    }
  }, [loggedIn]);

  return (
    <div>
      <NavBar />
      <header>
        <h1> RD dashboard</h1>
        <h1>{name ? `Welcome ${name}` : ""}</h1>
      </header>
    </div>
  );
};

export default RDdashboard;