import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { alert } from "../../assets";
import NavBar from "../nav/NavBar";
import "./Dashboard.css";

const RDdashboard = () => {
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
         <h1 className="font-semibold text-stone-700 text-3xl my-10">
           {" "}
           RD Dashboard
         </h1>
       </header>
     </div>
     <div className="text-center med:mt-5 med:mb-5 mb-10">
       <h1 className="text-2xl font-semibold text-stone-600">
         {name ? `Welcome ${name}` : ""}
       </h1>
     </div>
     <div className="grid grid-cols-2 justify-items-center md:justify-items-stretch">
       <div className="md:ml-40">
         <h1 className="text-2xl font-semibold text-stone-600">Resources</h1>
       </div>
       <div className="flex items-center gap-2 md:gap-4 justify-center md:justify-end text-stone-700 md:mr-40">
         <img src={alert} alt="logo" className="block  w-8 md:w-14" />
         <h3>
           You have <span className="font-bold">3</span>{" "}
           <Link to="/inbox">
             {" "}
             <span className="text-sky-700 underline">new messages</span>
           </Link>
         </h3>
       </div>
     </div>
     <hr className="rd-hr"></hr>
   </>
 );


};

export default RDdashboard;
