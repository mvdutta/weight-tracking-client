import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../nav/NavBar";
import "./Dashboard.css"

const CNAdashboard = () => {
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
    <>
      <div>
        <NavBar />
        <header>
          <h1> CNA Dashboard</h1>
          <h1>{name ? `Welcome ${name}` : ""}</h1>
        </header>
      </div>

      <div className="grid md:grid-cols-3 gap-4 justify-items-center md:mt-64">
        <div className="block rounded-lg bg-orange-100 p-6 shadow-lg dark:bg-neutral-700 w-[300px]">
          <h5 className="mb-10 text-xl font-body leading-tight text-neutral-800 dark:text-neutral-50 text-center">
            Weekly Weight Sheet
          </h5>
          <div className="flex justify-center">
            <Link to="/weeklysheet">
              <button
                type="button"
                className="rounded bg-primary px-6 pt-2.5 pb-2 font-body text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                View
              </button>
            </Link>
          </div>
        </div>
        <div className="block max-w-sm rounded-lg bg-orange-100 p-6 shadow-lg dark:bg-neutral-700 w-[300px]">
          <h5 className="mb-10 text-xl font-body leading-tight text-neutral-800 dark:text-neutral-50 text-center">
            Census List
          </h5>
          <div className="flex justify-center">
            <Link to="/censuslist">
              <button
                type="button"
                className="rounded bg-primary px-6 pt-2.5 pb-2 font-body text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                View
              </button>
            </Link>
          </div>
        </div>
        <div className="block max-w-sm rounded-lg bg-orange-100 p-6 shadow-lg dark:bg-neutral-700 w-[300px]">
          <h5 className="mb-10 text-xl font-body leading-tight text-neutral-800 dark:text-neutral-50 text-center">
            My Messages
          </h5>
          <div className="flex justify-center">
            <Link to="/inbox">
              <button
                type="button"
                className="rounded bg-primary px-6 pt-2.5 pb-2 font-body text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                View
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CNAdashboard;
