import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { alert, calculator, rdclipboard } from "../../assets";
import { fetchIt } from "../auth/fetchIt";
import NavBar from "../nav/NavBar";
import "./Dashboard.css";
import WeightSheetMenuModal from "../weightSheets/WeightSheetMenuModal";
import {
  formattedDate,
  formattedDateMDY,
  formattedDateUI,
} from "../utilities/FormattedDate";
import { Graph } from "./Graph";
import { getAPIroot } from "../utilities/getAPIroot";

const formatDecimal = (x) => {
  if (x === undefined || isNaN(x)) {
    return "";
  }
  return Number.parseFloat(x).toFixed(2);
};

const RDdashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResident, setSelectedResident] = useState({});
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [weightData, setWeightData] = useState({});
  const [numUnreadMsgs, setNumUnreadMsgs] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const APIROOT = getAPIroot();

  useEffect(() => {
    const user = localStorage.getItem("wt_token");
    if (user) {
      const parsedUser = JSON.parse(user);
      setName(parsedUser.name);
      fetchIt(
        `${APIROOT}employeemessages/unreadmessages?recipient=${parsedUser.id}`
      ).then((data) => {
        setNumUnreadMsgs(data.num_msgs);
      });
    }
  }, []);

  useEffect(() => {
    if (selectedResident && selectedResident.id) {
      fetchIt(
        `${APIROOT}weights/rd_summary?resident=${selectedResident.id}`
      ).then((data) => {
        setWeightData(data);
      });
    }
  }, [selectedResident]);

  const residentSearch = (e) => {
    const searchTerm = e.target.value;
    if (searchTerm.length > 0) {
      setShowSearchResults(true);
      fetchIt(`${APIROOT}residents?keyword=${searchTerm}`).then((data) => {
        setSearchResults(data);
      });
    } else {
      setShowSearchResults(false);
    }
  };

  const makeTableRow = () => {
    const {
      BMI,
      PBW,
      CBW,
      ABW,
      perc_change_1week,
      perc_change_1month,
      perc_change_3month,
      perc_change_6month,
    } = weightData;

    return (
      <>
        <tbody>
          <tr
            key={`table-row-${0}`}
            className="bg-white border-b text-sm sm:text-base text-stone-700 dark:bg-stone-800 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-600"
          >
            <td className="px-6 py-4 whitespace-nowrap dark:text-white">
              {formatDecimal(weightData.ABW)}
            </td>
            <td className="px-6 py-4">{formatDecimal(PBW)}</td>
            <td className="px-6 py-4">{formatDecimal(CBW)}</td>
            <td className="px-6 py-4">{formatDecimal(BMI)}</td>
            <td className="px-6 py-4">{formatDecimal(perc_change_1week)}</td>
            <td className="px-6 py-4">{formatDecimal(perc_change_1month)}</td>
            <td className="px-6 py-4">{formatDecimal(perc_change_3month)}</td>
            <td className="px-6 py-4">{formatDecimal(perc_change_6month)}</td>
          </tr>
        </tbody>
      </>
    );
  };

  return (
    <>
      <NavBar />
      <header className="flex justify-center">
        <h1 className="font-semibold text-stone-700 text-3xl my-8">
          {" "}
          RD Dashboard
        </h1>
      </header>
      <div className="text-center md:mt-5 mb-10 md:mb-28">
        <h1 className=" text-xl sm:text-2xl text-stone-600">
          {name ? `Welcome ${name}` : ""}
        </h1>
      </div>
      <div className="grid grid-rows-3 gap-3 sm:gap-6 md:grid-cols-3 ml-auto mr-auto text-sm sm:text-lg justify-items-start sm:justify-items-center w-[170px] md:w-[700px] lg:w-2/3 mb-14 sm:mb-2">
        <div className="flex items-center gap-2 text-stone-700 hover:underline ">
          <a
            href="https://mvdutta.github.io/metabolic-calculator/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={calculator}
              alt="calculator"
              className="block opacity-80 w-8 md:w-12"
            />
          </a>
          <a
            href="https://mvdutta.github.io/metabolic-calculator/"
            target="_blank"
            rel="noreferrer"
            className=""
          >
            Calculator
          </a>
        </div>
        <div
          className="flex items-center gap-2 md:gap-2 text-stone-700 hover:underline cursor-pointer"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <img
            src={rdclipboard}
            alt="rdclipboard"
            className="block opacity-80 w-8 md:w-12"
          />
          <span className="">Weight Sheets</span>
        </div>
        <Link to="/inbox">
          <div className="flex items-center gap-2 md:gap-4 text-stone-700 cursor-pointer">
            <img
              src={alert}
              alt="alert"
              className="block opacity-80 w-8 md:w-12"
            />
            <h3 className="flex sm:block">
              <span className="hidden lg:inline-block">You have </span>{" "}
              <span className="font-semibold text-sky-900 sm:text-lg">
                {numUnreadMsgs} 
              </span>{" "}
              <span className="text-stone-700 hover:underline ml-[2.6px] lg:ml-0">
                unread message(s)
              </span>
            </h3>
          </div>
        </Link>
      </div>
      <hr className="rd-hr"></hr>

      <header className="flex justify-center">
        <h1 className="text-stone-600 font-semibold text-xl my-10">
          {" "}
          Resident Weight Summary
        </h1>
      </header>

      <div className="flex items-center justify-start gap-2 sm:gap-0 mt-5 sm:mt-10 ml-5 sm:ml-10 lg:ml-60">
        <div className="">
          <h1 className="text-stone-600 font-semibold sm:text-lg">
            Search by Resident:
          </h1>
        </div>
        <div>
          <form className=" w-[175px]  sm:w-full sm:px-4">
            <div className="relative">
              <svg
                className="absolute top-0 bottom-0 w-5 sm:w-6 h-5 sm:h-6 my-auto text-gray-400 left-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  residentSearch(e);
                }}
                className="w-full py-1 pl-12 pr-4 text-sm sm:text-lg text-stone-700 text-md border-2 border-stone-300 rounded-md  bg-stone-100 focus:bg-white focus:border-stone-400"
              />
            </div>
          </form>
        </div>
      </div>
      {showSearchResults ? (
        <div className="inline-block border-2 border-stone-200/60 rounded-md p-2 mt-5 mb-10 ml-5 sm:ml-10 lg:ml-60">
          {searchResults.map((result) => {
            return (
              <div key={`result--${result.id}`} className="">
                <button
                  className="text-sky-800 hover:text-sky-500"
                  onClick={() => {
                    setSelectedResident(result);
                    setShowSearchResults(false);
                  }}
                >
                  {result.first_name} {result.last_name}
                </button>
              </div>
            );
          })}
        </div>
      ) : ""}
      {searchResults.length === 0 ? (
        ""
      ) : (
        <div>
          <h1 className="text-lg ml-5 sm:ml-10 lg:ml-60 mt-20 mb-10 text-stone-800">
            Weight Summary for:{" "}
            <span className="italic text-stone-700 ">
              {selectedResident.first_name} {selectedResident.last_name}
            </span>
          </h1>
        </div>
      )}
      {searchResults.length === 0 ? (
        ""
      ) : (
        <div className=" container flex flex-col m-auto sm:shadow-md sm:rounded-lg w-full lg:w-2/3 font-body border border-stone-600/30 pb-5 px-4 text-sm md:text-lg overflow-x-scroll">
          <div className="w-auto overflow-x-scroll">
            <table className="text-md text-stone-700 dark:text-stone-500">
              <caption className="p-5 text-lg font-semibold text-stone-800 bg-white dark:text-white dark:bg-gray-800">
                <p className="text-left">
                  {selectedResident.first_name} {selectedResident.last_name}
                </p>
                <div className="flex justify-between">
                  <p className="mt-1 text-base text-stone-700 dark:text-stone-300">
                    Admission Date:{" "}
                    {formattedDateUI(selectedResident.admission_date)}
                  </p>
                  <p className="mt-1 text-base text-stone-700 dark:text-stone-300">
                    Current Date: {formattedDateMDY(new Date())}
                  </p>
                </div>
              </caption>
              <thead className="text-xs sm:text-sm text-sky-900 font-semibold bg-stone-200 dark:bg-stone-700 dark:text-stone-400">
                <tr>
                  <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3">
                    ABW (lbs)
                  </th>
                  <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3">
                    PBW (lbs)
                  </th>
                  <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3">
                    CBW (lbs)
                  </th>
                  <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3">
                    BMI (kg/m^2)
                  </th>
                  <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3">
                    % Change x 1 week
                  </th>
                  <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3">
                    % Change x 1 month
                  </th>
                  <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3">
                    % Change x 3 months
                  </th>
                  <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3">
                    % Change x 6 months
                  </th>
                </tr>
              </thead>
              {makeTableRow()}
            </table>
          </div>
          <div className="text-stone-600 text-xs mt-3 tracking-wider">
            <p>ABW: Admission Body Weight</p>
            <p>PBW: Previous Body Weight (previous week or measurement)</p>
            <p>CBW: Current Body Weight</p>
            <p>BMI: Body Mass Index </p>
            <p>
              Clinically Significant Weight Loss: >/= 5% in 1 month or less, >/=
              7.5% in 7 mos., >/= 10% in 6 mos.
            </p>
          </div>
        </div>
      )}
      <WeightSheetMenuModal showModal={showModal} setShowModal={setShowModal} />
      {selectedResident && selectedResident.id ? (
        <Graph
          id={selectedResident?.id}
          name={`${selectedResident.first_name} ${selectedResident.last_name}`}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default RDdashboard;
