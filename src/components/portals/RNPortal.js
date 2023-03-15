import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RNPortal = () => {
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
        <header>
          <h1> RD Portal</h1>
          <h1>{name ? `Welcome ${name}` : ""}</h1>
        </header>
        <div>
          <button
            className="btn1 border-2 border-gray-400 bg-orange-200"
            onClick={() => {
              if (
                window.confirm(`${name}, are you sure you want to log out?`)
              ) {
                setLoggedIn(false);
                setName("");
                localStorage.removeItem("wt_token");
                navigate("/", { replace: true });
              }
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    );
  
}

export default RNPortal