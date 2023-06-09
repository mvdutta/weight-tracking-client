import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchIt } from "./fetchIt";
import "./Login.css";
import RegisterModal from "./RegisterModal";
import { logo } from "../../assets";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getAPIroot } from "../utilities/getAPIroot";
import Spinner from "../utilities/Spinner";
import BypassLoginModal from "./BypassLoginModal";




export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const APIROOT = getAPIroot()
  const [showSpinner, setShowSpinner] = useState(false);
  const [showBypassModal, setShowBypassModal] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "") {
     MySwal.fire({
       title: "Please enter your username",
       confirmButtonColor: "#DAA520",
       customClass: "sweet-warning",
       showClass: {
         popup: "animate__animated animate__fadeInDown",
       },
       hideClass: {
         popup: "animate__animated animate__fadeOutUp",
       },
     });
      return;
    }
    if (password === "") {
      MySwal.fire({
        title: "Please enter your password",
        confirmButtonColor: "#DAA520",
        customClass: "sweet-warning",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      return;
    }
    setShowSpinner(true)
    fetch(`${APIROOT}login`, {
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
           MySwal.fire({
             title: "Invalid Credentials",
             confirmButtonColor: "#DAA520",
             customClass: "sweet-warning",
             showClass: {
               popup: "animate__animated animate__fadeInDown",
             },
             hideClass: {
               popup: "animate__animated animate__fadeOutUp",
             },
           });
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
        setShowSpinner(false)
        navigate(whichProfile);
      });
  };

  return (
    <>
      <figure className="h-screen flex -mb-60">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border-2 shadow-md shadow-sky-800/30 pb-6 px-1">
          <div className="text-2xl font-medium text-center">
            <p className="-mt-[103px]">
              <img
                className="w-[260px] m-auto opacity-98"
                src={logo}
                alt="weightTrackingLogo"
              />
            </p>
          </div>
          <div className="flex items-center justify-center">
            <h1 className="text-[21px] font-medium font-body text-burnt -mt-[100px]">
              Sign in to your account
            </h1>
          </div>
          <div className=" text-gray-700 ml-6 mr-6 ">
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
                    handleLogin(evt);
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
                    handleLogin(evt);
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
              <div className="flex items-center mt-6 mb-6 justify-center">
                <button
                  disabled={showSpinner}
                  className={
                    "bg-sky-600 hover:bg-sky-400 py-2 px-5 uppercase text-xs font-bold text-white rounded-full border shadow border-blue focus:outline-none focus:border-stone-200 disabled:opacity-50 disabled:hover:bg-sky-600"
                  }
                  value="Login"
                  onClick={(e) => {
                    handleLogin(e);
                  }}
                >
                  Sign In
                </button>
              </div>
              <div className="flex items-center mt-3 justify-center">
                {showSpinner ? <Spinner /> : ""}
              </div>
            </form>
            <div className="flex items-center justify-center">
              <RegisterModal />
            </div>
          </div>
        </div>
      </figure>
      <div className="flex justify-center mt-5">
        <a
          className=" text-burnt underline sm:text-md font-bold  my-6 sm:my-3 cursor-pointer"
          onClick={() => {
            setShowBypassModal(true);
          }}
        >
          Guest User Sign In
        </a>
        <BypassLoginModal 
        showBypassModal={showBypassModal}
        setShowBypassModal={setShowBypassModal}
        />
      </div>
    </>
  );
};
