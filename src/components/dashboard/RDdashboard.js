import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link} from "react-router-dom";
import { alert, calculator } from "../../assets";
import { fetchIt } from "../auth/fetchIt";
import NavBar from "../nav/NavBar";
import "./Dashboard.css";
import WeightSheetMenuModal from "./WeightSheetMenuModal";

const formatDecimal = (x) => Number.parseFloat(x).toFixed(2);



const RDdashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState([])
  const [selectedResident, setSelectedResident] = useState({})
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [weightData, setWeightData] = useState({})
  const [numUnreadMsgs, setNumUnreadMsgs] = useState(0);
  const [showModal, setShowModal] = useState(false);

   useEffect(() => {
     const user = localStorage.getItem("wt_token");
     if (user) {
       const parsedUser = JSON.parse(user);
       setName(parsedUser.name);
       fetchIt(
         `http://localhost:8000/employeemessages/unreadmessages?recipient=${parsedUser.id}`
       ).then((data) => {
         setNumUnreadMsgs(data.num_msgs);
       });
     }
   }, [loggedIn]);




  useEffect(()=>{
    if (selectedResident && selectedResident.id) {
    fetchIt(`http://localhost:8000/weights/rd_summary?resident=${selectedResident.id}`)
    .then((data)=>{
        setWeightData(data)
    })
  }

  },[selectedResident])
  

  const residentSearch = (e) => {
    const searchTerm = e.target.value
    if(searchTerm.length > 0 ){
      setShowSearchResults(true)
    fetchIt(`http://localhost:8000/residents?keyword=${searchTerm}`)
    .then((data) => {
      setSearchResults(data)
    })
  } else{
    setShowSearchResults(false)
  }
  };

  const formattedDate = (date) => {
    const myDate = date;
    let year = myDate.toLocaleString("default", { year: "numeric" });
    let month = myDate.toLocaleString("default", { month: "2-digit" });
    let day = myDate.toLocaleString("default", { day: "2-digit" });
    const formattedDate = month + "-" + day + "-" + year;
    return formattedDate;
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
          className="bg-white border-b text-base  text-stone-700  dark:bg-stone-800 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-600"
        >
          <td
            scope="row"
            className="px-6 py-4 whitespace-nowrap dark:text-white"
          >
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
  );};


 return (
   <>
     <NavBar />
     <header className="flex justify-center">
       <h1 className="font-semibold text-stone-700 text-2xl my-8">
         {" "}
         RD Dashboard
       </h1>
     </header>
     <div className="text-center md:mt-5 mb-10 md:mb-20">
       <h1 className="text-xl text-stone-600">
         {name ? `Welcome ${name}` : ""}
       </h1>
     </div>
     <div className="grid grid-cols-3  justify-items-center md:justify-items-between">
       <div>
         <a
           href="https://mvdutta.github.io/metabolic-calculator/"
           target="_blank"
         >
           <img
             src={calculator}
             alt="logo"
             className="block opacity-80 w-8 md:w-14"
           />
         </a>
       </div>
       <div
         onClick={() => {
           setShowModal(true);
         }}
       >
         RD Weight Sheets
       </div>
       <div className="flex items-center gap-2 md:gap-4 justify-center md:justify-end text-stone-700  ">
         <img src={alert} alt="logo" className="block opacity-80 w-8 md:w-14" />
         <h3 className="text-md">
           You have <span className="font-bold">{numUnreadMsgs}</span>{" "}
           <Link to="/inbox">
             {" "}
             <span className="text-sky-700 underline">unread messages</span>
           </Link>
         </h3>
       </div>
     </div>
     <hr className="rd-hr"></hr>

     <header className="flex justify-center">
       <h1 className="text-stone-700 text-xl font-semibold my-10">
         {" "}
         Resident Weight Summary
       </h1>
     </header>

     <div className="flex items-center ml-10 sm:ml-20  md:ml-60">
       <div>
         <h1 className="text-stone-700 font-semibold text-lg">
           Search by Resident:
         </h1>
       </div>
       <div>
         <form className="max-w-sm px-2">
           <div className="relative">
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
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
               className=" w-full py-1 pl-12 pr-4 text-stone-700 border-2 border-stone-300 rounded-md  bg-stone-100 focus:bg-white focus:border-sky-600"
             />
           </div>
         </form>
       </div>
     </div>
     {showSearchResults ? (
       <div className="inline-block border-2 border-stone-200/60 rounded-md p-2 mt-5 ml-10 sm:ml-20  md:ml-60">
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
     ) : (
       <div className="inline-block ml-40 mb-10"></div>
     )}
     {searchResults.length === 0 ? (
       ""
     ) : (
       <div>
         <h1 className="text-xl ml-10 sm:ml-20 md:ml-60 mt-5 mb-10 text-stone-800">
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
       <div className=" container flex flex-col m-auto before:relative shadow-md sm:rounded-lg md:w-1/2 font-body border-solid border-2 border-sky-600/20 pb-5 px-4">
         <table className="text-md  text-stone-700 dark:text-stone-500">
           <caption className="p-5 text-lg font-semibold text-stone-800 bg-white dark:text-white dark:bg-gray-800">
             <p className="text-left">
               {selectedResident.first_name} {selectedResident.last_name}
             </p>
             <div className="flex justify-between ">
               <p className="mt-1 text-base text-stone-700 dark:text-stone-300">
                 Admission Date: {selectedResident.admission_date}
               </p>
               <p className="mt-1 text-base text-stone-700 dark:text-stone-300">
                 Current Date: {formattedDate(new Date())}
               </p>
             </div>
           </caption>
           <thead className="text-sm text-sky-900  font-semibold bg-stone-200 dark:bg-stone-700 dark:text-stone-400">
             <tr>
               <th scope="col" className="px-6 py-3">
                 ABW (lbs)
               </th>
               <th scope="col" className="px-6 py-3">
                 PBW (lbs)
               </th>
               <th scope="col" className="px-6 py-3">
                 CBW (lbs)
               </th>
               <th scope="col" className="px-6 py-3">
                 BMI (kg/m^2)
               </th>
               <th scope="col" className="px-6 py-3">
                 % Change x 1 wk
               </th>
               <th scope="col" className="px-6 py-3">
                 % Change x 1 month
               </th>
               <th scope="col" className="px-6 py-3">
                 % Change x 3 mos.
               </th>
               <th scope="col" className="px-6 py-3">
                 % Change x 6 mos.
               </th>
             </tr>
           </thead>
           {makeTableRow()}
         </table>
         <div className="text-stone-600 text-xs mt-3">
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
     <hr className="rd-hr mt-14"></hr>
     <WeightSheetMenuModal showModal={showModal} setShowModal={setShowModal} />
   </>
 );

};

export default RDdashboard;





