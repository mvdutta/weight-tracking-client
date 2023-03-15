import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'

export const Login = () => {
    const [username, setUsername] = useState("mjackson");
    const [password, setPassword] = useState("giraffes22");
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();




const handleLogin = (e) => {
    e.preventDefault()
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
        console.log(authInfo)
      if (authInfo.valid) {
        localStorage.setItem(
          "wt_token",
          JSON.stringify({
            id: authInfo.id,
            token: authInfo.token,
            name: authInfo.name,
            role: authInfo.role
          })
        );
        setLoggedIn(true);
        window.alert("Login successful")
        navigate("/home");
      } else {
        window.alert("Invalid login");
      }
    });
};


  return (
    <figure className="h-screen flex bg-gray-100">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-1">
        <blockquote className="text-2xl font-medium text-center">
          <p className="text-lg font-semibold">Welcome to My-App</p>
        </blockquote>

        <div className="text-primary m-6">
          <div className="flex items-center mt-3 justify-center">
            <h1 className="text-2xl font-medium text-primary mt-4 mb-2">
              Login to your account
            </h1>
          </div>
          <form>
            <label className="text-left">Username:</label>
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
                "w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
              }
            />
            <label>Password:</label>
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
                "w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
              }
            />
            <div className="flex items-center mt-3 justify-center">
              <button
                className={
                  "bg-blue-700 hover:bg-blue-500 py-2 px-4 text-md text-white rounded border border-blue focus:outline-none focus:border-black"
                }
                value="Login"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>
          <div className="flex items-center mt-3 justify-center">
            <button className={"justify-center text-blue-500 hover:underline"}>
              Need to register? Sign up for free
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
}
