import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchIt } from "./fetchIt";
import "./Login.css";
import RegisterModal from "./RegisterModal";

export const Login = () => {
  const [username, setUsername] = useState("sreese");
  const [password, setPassword] = useState("tigers123");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "") {
      window.alert("Please enter your username");
      return;
    }
    if (password === "") {
      window.alert("Please enter your password");
      return;
    }
    fetch(`http://localhost:8000/login`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((authInfo) => {
        if (authInfo && authInfo.valid) {
          localStorage.setItem(
            "wt_token",
            JSON.stringify({
              id: authInfo.id,
              token: authInfo.token,
              name: authInfo.name,
              role: authInfo.role,
            })
          );
          setLoggedIn(true);
        } else {
          window.alert("Invalid login");
        }
      })
      .then(() => {
        const wtToken = localStorage.getItem("wt_token");
        const wtTokenParsed = JSON.parse(wtToken);
        const role = wtTokenParsed.role;
        let whichProfile = "";
        if (role === "CNA") {
          whichProfile = "/cnadashboard";
        } else if (role === "RD") {
          whichProfile = "/rddashboard";
        } else {
          whichProfile = "/rndashboard";
        }
        navigate(whichProfile);
      });
  };

  return (
    <figure className="h-screen flex">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border-2 shadow-default py-10 px-1">
        <blockquote className="text-2xl font-medium text-center">
          <p className="text-2xl text-primary font-body font-semibold mb-5">
            Welcome to WeightTracker
          </p>
        </blockquote>

        <div className=" text-gray-700 m-6">
          <div className="flex items-center mt-3 justify-center">
            <h1 className="text-2xl font-medium font-body text-burnt mb-2">
              Login to your account
            </h1>
          </div>
          <form>
            <label className="text-left text-dark font-bold font-body">
              Username:
            </label>
            <input
              name="username"
              type="text"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
              onKeyUp={(evt) => {
                if (evt.key === "Enter") {
                  handleLogin();
                }
              }}
              required
              autoFocus
              placeholder="Username"
              className={
                "w-full text-base p-2 text-burnt border-2 rounded-md outline-none  transition duration-150 ease-in-out mb-4"
              }
            />
            <label className="text-dark font-body">Password:</label>
            <input
              onChange={(evt) => setPassword(evt.target.value)}
              onKeyUp={(evt) => {
                if (evt.key === "Enter") {
                  handleLogin();
                }
              }}
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              required
              className={
                "w-full p-2 text-burnt border-2 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
              }
            />
            <div className="flex items-center mt-3 justify-center">
              <button
                className={
                  "bg-sky-600 hover:bg-primary py-2 px-4 text-md text-white rounded border border-blue focus:outline-none focus:border-black"
                }
                value="Login"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>
          <div className="flex items-center mt-3 justify-center">
            <button className={"justify-center text-primary hover:underline"}>
              <RegisterModal />
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
};
