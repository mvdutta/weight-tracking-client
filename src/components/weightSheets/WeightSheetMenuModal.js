import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { close } from "../../assets";
import { fetchIt } from "../auth/fetchIt";
import { formattedDate, formattedDateUI } from "../utilities/FormattedDate";
import { getAPIroot } from "../utilities/getAPIroot";

const APIROOT = getAPIroot();

const WeightSheetMenuModal = ({ showModal, setShowModal}) => {

    const [dates, setDates] = useState([])
    const [newDate, setNewDate] = useState(formattedDate(new Date()))
    const [role, setRole] = useState("")
    const navigate = useNavigate();
          const descriptor =
            role === "RD" || role === "CNA" ? "Recent" : "Available";

      useEffect(() => {
        const current_user = localStorage.getItem("wt_token");
        let address = ""
        if (current_user) {
          const parsedUser = JSON.parse(current_user);
            setRole(parsedUser.role)
            if (parsedUser.role==="CNA" || parsedUser.role ==="RD"){
                address = `${APIROOT}weightsheets/dates`;
            }else{
                address = `${APIROOT}weightsheets/finalized_dates`;
            }
            fetchIt(address).then(
                (data) => {
                setDates(data.dates);
                }
            );
        } else {
          navigate("/home");
        }
      }, [showModal]);//putting showModal in dependency array makes the modal update every time it is opened


    const whichSheet = {
      CNA: "/weeklysheet",
      RD: "/weightsheetsummary",
      MD: "/weightsummary",
      RN: "/weightsummary",
      LPN: "/weightsummary",
      NP: "/weightsummary",
    };

    const makeDateList = () =>{

      const recentDates = dates.length>4? dates.slice(0,4):dates
      const dateList = role==="RD" || role === "CNA" ? recentDates : dates

      
        return (
          <ul>
            {dateList.map((el, index) => {
                const encodedDate = encodeURI(el)
             return (
               <li key={index}>
                 <Link
                   className="text-sky-900/90 text-[16px] dark:text-blue-500 hover:underline"
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
            <div className="relative w-full sm:w-[600px] lg:w-1/3 my-6 mx-auto">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-stone-100 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-stone-200 rounded-t">
                  <h3 className=" text-xl md:text-2xl font-body text-stone-700 font-semibold">
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
                <div className="relative p-6 flex-auto text-stone-700 font-semibold">
                  <div
                    className={
                      role === "RD" || role === "CNA" ? "flex gap-2" : "hidden"
                    }
                  >
                    <p className=" sm:text-lg">Create/Open Weight Sheet for: </p>
                    <input
                      type="date"
                      className="mb-8 text-sky-900/90 text-[16px]"
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
                  <p className="mb-4 sm:text-lg">{descriptor} Weight Sheets:</p>
                  <div className="overflow-auto w-1/3 h-28">{makeDateList()}</div>
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
