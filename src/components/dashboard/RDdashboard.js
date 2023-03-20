import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link} from "react-router-dom";
import { alert } from "../../assets";
import { fetchIt } from "../auth/fetchIt";
import NavBar from "../nav/NavBar";
import "./Dashboard.css";

const RDdashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState([])
  const [selectedResident, setSelectedResident] = useState({})
  const [showSearchResults, setShowSearchResults] =useState(false)

  useEffect(() => {
    const user = localStorage.getItem("wt_token");
    if (user) {
      setName(JSON.parse(user).name);
    }
  }, [loggedIn]);


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


 return (
   <>
     <div>
       <NavBar />
       <header className="flex justify-center">
         <h1 className="font-semibold text-stone-700 text-3xl my-10">
           {" "}
           RD Dashboard
         </h1>
       </header>
     </div>
     <div className="text-center med:mt-5 med:mb-5 mb-10">
       <h1 className="text-2xl text-stone-600">
         {name ? `Welcome ${name}` : ""}
       </h1>
     </div>
     <div className="grid grid-cols-2 justify-items-center md:justify-items-stretch">
       <div className="md:ml-64">
         <h1 className="text-lg font-semibold text-stone-600">Resources</h1>
       </div>
       <div className="flex items-center gap-2 md:gap-4 justify-center md:justify-end text-stone-700 md:mr-64">
         <img src={alert} alt="logo" className="block  w-8 md:w-14" />
         <h3 className="text-md">
           You have <span className="font-bold">3</span>{" "}
           <Link to="/inbox">
             {" "}
             <span className="text-sky-700 underline">new messages</span>
           </Link>
         </h3>
       </div>
     </div>
     <hr className="rd-hr"></hr>

     <header className="flex justify-center">
       <h1 className="text-stone-700 text-2xl my-10">
         {" "}
         Resident Weight Summary
       </h1>
     </header>

     <div className="flex items-center ml-40">
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
       <div className="inline-block border-2 border-stone-200/60 rounded-md p-2 mt-5 ml-40">
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
     <div>
       <h1 className="text-xl ml-10 mt-10 text-stone-800">
         Weight Summary for:{" "}
         <span className="italic text-stone-700 ">
           {selectedResident.first_name} {selectedResident.last_name}
         </span>
       </h1>
     </div>
   </>
 );


};

export default RDdashboard;





