import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../nav/NavBar";
import "./Dashboard.css"
import { scale, list, message } from "../../assets";

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
        <header className="flex justify-center">
          <h1 className="font-semibold text-burnt text-3xl my-10">
            {" "}
            CNA Dashboard
          </h1>
        </header>
      </div>
      <div className="grid grid-cols-2 justify-items-center mb-[150px]">
        <div className="col-span-1">
          <h1 className=" flex-col text-2xl font-semibold text-stone-600">
            {name ? `Welcome ${name}` : ""}
          </h1>
        </div>
        <div className="flex items-center gap-6 col-span-1">
          <img src={message} alt="logo" className="block w-16" />
          <h3>You have 3 new messages</h3>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-10 md:gap-0 justify-items-center">
        <Link to="/weeklysheet">
          <div className="flex-col  content-center rounded-lg bg-amber-200/70 p-6 shadow-xl dark:bg-neutral-700 w-[300px]">
            <h5 className="mb-5 text-xl font-body leading-tight  text-sky-800 text-center">
              Weekly Weight Sheet
            </h5>
            <div className="flex justify-center mb-5">
              <img src={scale} alt="logo" className="block w-16" />
            </div>
            <div className="flex justify-center"></div>
          </div>
        </Link>
        <Link to="/censuslist">
          <div className="flex-col  content-center rounded-lg bg-amber-200/70 p-6 shadow-xl dark:bg-neutral-700 w-[300px]">
            <h5 className="mb-5 text-xl font-body leading-tight  text-sky-800 text-center">
              Census List
            </h5>
            <div className="flex justify-center mb-5">
              <img src={list} alt="logo" className="block w-16" />
            </div>
            <div className="flex justify-center"></div>
          </div>
        </Link>
        <Link to="/inbox">
          <div className="flex-col  content-center rounded-lg  bg-amber-200/70 p-6 shadow-xl dark:bg-neutral-700 w-[300px] mb-16">
            <h5 className="mb-5 text-xl font-body leading-tight text-sky-800 text-center">
              My Messages
            </h5>
            <div className="flex justify-center mb-5">
              <img src={message} alt="logo" className="block w-16" />
            </div>
            <div className="flex justify-center"></div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default CNAdashboard;
