import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { close } from "../../assets";
import { fetchIt } from "../auth/fetchIt";
import { formattedDate, formattedDateUI } from "../utilities/FormattedDate";

const WeightSheetMenuModal = ({ showModal, setShowModal}) => {

    const [dates, setDates] = useState([])
    const [newDate, setNewDate] = useState(formattedDate(new Date()))
    const [role, setRole] = useState("")
    const navigate = useNavigate();

      useEffect(() => {
        const current_user = localStorage.getItem("wt_token");
        let address = ""
        if (current_user) {
          const parsedUser = JSON.parse(current_user);
            setRole(parsedUser.role)
            if (parsedUser.role==="CNA" || parsedUser.role ==="RD"){
                address = "http://localhost:8000/weightsheets/dates";
            }else{
                address = "http://localhost:8000/weightsheets/finalized_dates";
            }
            fetchIt(address).then(
                (data) => {
                setDates(data.dates);
                }
            );
        } else {
          navigate("/home");
        }
      }, []);


    const whichSheet = {
      CNA: "/weeklysheet",
      RD: "/weightsheetsummary",
      MD: "/weightsummary",
      RN: "/weightsummary",
      LPN: "/weightsummary",
      NP: "/weightsummary",
    };

    const makeDateList = () =>{
        return (
          <ul>
            {dates.map((el, index) => {
                const encodedDate = encodeURI(el)
             return (
               <li key={index}>
                 <Link
                   className="text-sky-900 text-[17px] dark:text-blue-500 hover:underline"
                   to={`${whichSheet[role]}\\${encodedDate}`}
                 >
                   {formattedDateUI(el)}
                 </Link>
               </li>
             );
            }
            )}
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
            <div className="relative md:w-2/3 lg:w-1/3 my-6 mx-auto">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-sky-100 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-stone-200 rounded-t">
                  <h3 className="text-2xl font-body text-stone-700 font-semibold">
                    Weight Sheet Menu
                  </h3>
                  <button
                    className="p-1 ml-auto float-right leading-none outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span>
                      <img className="w-7" src={close} alt="close-icon" />
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto text-stone-700 text-sm md:text-lg font-semibold">
                  <div
                    className={
                      role === "RD" || role === "CNA" ? "flex gap-2" : "hidden"
                    }
                  >
                    <p className="">Create/Open Weight Sheet for: </p>
                    <input
                      type="date"
                      className="mb-8 text-sky-900 text-[17px]"
                      value={newDate}
                      onChange={(e) => {
                        setNewDate(e.target.value);
                      }}
                    ></input>
                    <div>
                      <Link
                        className="bg-amber-500/90 hover:bg-amber-400 py-2 px-3 md:py-2 md:px-4 text-sm md:text-md text-white font-bold rounded-full border focus:outline-none focus:border-amber-500 ml-6"
                        to={`${whichSheet[role]}/${encodeURI(newDate)}`}
                      >
                        {dates.includes(newDate) ? "Open" : "Create"}
                      </Link>
                    </div>
                  </div>
                  <p className="mb-2">Available Weight Sheets</p>
                  {makeDateList()}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-stone-200 rounded-b"></div>
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
