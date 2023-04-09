import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { close } from "../../assets";
import { fetchIt } from "../auth/fetchIt";
import { formattedDate } from "./utils";

const WeightSheetMenuModal = ({ showModal, setShowModal}) => {

    const [dates, setDates] = useState([])
    const [newDate, setNewDate] = useState(formattedDate(new Date()))
    useEffect(()=>{
        fetchIt("http://localhost:8000/weightsheets/dates")
        .then((data)=>{
            console.log(data)
            setDates(data.dates)
        })

    },[])

    const makeDateList = () =>{
        return (
          <ul>
            {dates.map((el) => (
              <li>
                <Link
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  to="/weeklysheet"
                  state={{ date: el }}
                >
                  {el}
                </Link>
              </li>
            ))}
          </ul>
        );
    } 

    const closeModal = () =>{
        setNewDate(formattedDate(new Date()));
        setShowModal(false)
    }
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-scroll fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative  w-2/3 md:w-1/3 my-6 mx-auto">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-stone-200 rounded-t">
                  <h3 className="text-xl font-body text-stone-700 font-semibold">
                    Weightsheet Menu
                  </h3>
                  <button
                    className="p-1 ml-auto float-right leading-none outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="">
                      <img className="w-7" src={close} alt="close-icon" />
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex space-x-4">
                    <p>Create/Open  WeightSheet for </p>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => {
                        setNewDate(e.target.value);
                      }}
                    ></input>
                    <Link
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      to="/weeklysheet" state={{ date: newDate }}
                    >
                      {dates.includes(newDate)?"Open":"Create"}
                    </Link>
                  </div>
                  <p>Available Weightsheets</p>
                  {makeDateList()}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-stone-200 rounded-b">
                  <button
                    className="bg-amber-500/90 hover:bg-amber-400 py-2 px-3 md:py-3 md:px-4 text-sm md:text-md text-white rounded-full font-bold border focus:outline-none focus:border-amber-600"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default WeightSheetMenuModal;
