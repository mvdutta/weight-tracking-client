import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../nav/NavBar";
import "./Dashboard.css"
import { scale, list, message, alert } from "../../assets";
import { fetchIt } from "../auth/fetchIt";
import Footer from "../footer/Footer";
import WeightSheetMenuModal from "./WeightSheetMenuModal";



const CNAdashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [numUnreadMsgs, setNumUnreadMsgs] = useState(0)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("wt_token");
    if (user) {
      const parsedUser = JSON.parse(user);
      setName(parsedUser.name);
      fetchIt(
        `http://localhost:8000/employeemessages/unreadmessages?recipient=${parsedUser.id}`
      ).then((data) => {
       setNumUnreadMsgs(data.num_msgs)
      });
    }
  }, []);

  return (
    <>
      <div>
        <NavBar />
        <header className="flex justify-center">
          <h1 className="font-semibold text-stone-700 text-2xl my-8">
            {" "}
            CNA Dashboard
          </h1>
        </header>
      </div>
      <div className="text-center md:mt-5 md:mb-5 mb-10">
        <h1 className="text-xl font-semibold text-stone-600">
          {name ? `Welcome ${name}` : ""}
        </h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4 justify-center md:justify-end  md:mr-60 mt-5 mb-12 md:mb-[125px] text-stone-700">
        <img src={alert} alt="logo" className="block opacity-80 w-8 md:w-14" />
        <h3>
          You have <span className="font-bold">{numUnreadMsgs}</span>{" "}
          <Link to="/inbox">
            {" "}
            <span className="text-sky-700 underline">unread message(s)</span>
          </Link>
        </h3>
      </div>
      <div className="grid lg:grid-cols-3 gap-10 lg:gap-0 justify-items-center lg:m-auto lg:w-2/3">
        <Link to="">
          <div
            className=" rounded-lg p-6 shadow-lg shadow-sky-800/50 border-2 bg-amber-200/40 w-[300px] transform transition duration-500 hover:scale-90 hover:bg-sky-200/50"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <h5 className="mb-5 text-lg font-body leading-tight  text-sky-800 font-semibold text-center">
              Weekly Weight Sheets
            </h5>
            <div className="flex justify-center mb-5">
              <img src={scale} alt="logo" className="block w-16" />
            </div>
          </div>
        </Link>
        <Link to="/censuslist">
          <div className="rounded-lg p-6 bg-amber-200/40 shadow-lg shadow-sky-800/50 border-2 w-[300px] transform transition duration-500 hover:scale-90 hover:bg-sky-200/50">
            <h5 className="mb-5 text-lg font-body leading-tight text-sky-800 font-semibold text-center">
              Census List
            </h5>
            <div className="flex justify-center mb-5">
              <img src={list} alt="logo" className="block w-16" />
            </div>
          </div>
        </Link>
        <Link to="/inbox">
          <div className="rounded-lg p-6 shadow-lg border-2 shadow-sky-800/50 bg-amber-200/40 w-[300px] mb-16 transform transition duration-500 hover:scale-90 hover:bg-sky-200/50">
            <h5 className="mb-5 text-lg font-body leading-tight text-sky-800 font-semibold text-center">
              My Messages
            </h5>
            <div className="flex justify-center mb-5">
              <img src={message} alt="logo" className="block w-16" />
            </div>
          </div>
        </Link>
      </div>
      <WeightSheetMenuModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default CNAdashboard;
