import React, { useState } from "react";
import { close } from "../../assets";
import Spinner from "../utilities/Spinner";
import { getAPIroot } from "../utilities/getAPIroot";
import { useNavigate } from "react-router-dom";

const BypassLoginModal = ({showBypassModal, setShowBypassModal}) => {
    const [showSpinner, setShowSpinner] = useState(false);
    const navigate = useNavigate();
    const APIROOT = getAPIroot();

      const handleLogin = (loginType) => {

        let userName = ""
        let password = "password123"

        if (loginType === "CNA") {
            userName = "guestCNA"
        } else if ( loginType === "RD") {
            userName = "guestRD"
        } else if ( loginType === "NP") {
            userName = "guestNP"
        } else {
            throw new Error("Invalid Login Type Provided")
        }
        setShowSpinner(true);
        fetch(`${APIROOT}login`, {
          method: "POST",
          body: JSON.stringify({
            username: userName,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((authInfo) => {
              localStorage.setItem(
                "wt_token",
                JSON.stringify({
                  id: authInfo.id,
                  token: authInfo.token,
                  name: authInfo.name,
                  role: authInfo.role,
                })
              ); 
          })
          .then(() => {
            const wtToken = localStorage.getItem("wt_token");
            const wtTokenParsed = JSON.parse(wtToken);
            const role = wtTokenParsed.role;
            let whichProfile = "";
            if (role === "CNA") {
              whichProfile = "/cnadashboard";
            } else if (role === "RD") {
              whichProfile = "/rddashboard";
            } else {
              whichProfile = "/rndashboard";
            }
            setShowSpinner(false);
            navigate(whichProfile);
          });
      };
   return (
     <>
       {showBypassModal ? (
         <>
           <div className="justify-center items-center flex overflow-scroll fixed inset-0 z-50 outline-none focus:outline-none">
             <div className="relative  w-100 lg:w-1/3 my-6 mx-auto">
               {/*content*/}
               <div className="border-0 rounded-lg shadow-xl relative flex flex-col w-full bg-white outline-none focus:outline-none">
                 {/*header*/}
                 <div className="flex items-start justify-between p-5 border-b border-solid border-stone-200 rounded-t">
                   <h3 className="text-xl font-body text-stone-700 font-semibold">
                     {"Choose a Guest Role to Sign In:"}
                   </h3>
                   <button
                     className="p-1 ml-auto float-right leading-none outline-none focus:outline-none"
                     onClick={() => setShowBypassModal(false)}
                   >
                     <span className="">
                       <img className="w-7 invisible lg:visible" src={close} alt="close-icon" />
                     </span>
                   </button>
                 </div>
                 {/*body*/}
                 <div className="relative p-6 flex-auto">
                   <p className="my-3 text-stone-600 text-lg leading-relaxed underline">
                     <div>
                       <a
                         className="cursor-pointer"
                         onClick={(e) => {
                           e.preventDefault();
                           handleLogin("CNA");
                         }}
                       >
                         Certified Nursing Assistant (CNA)
                       </a>
                     </div>
                     <div>
                       <a
                         className="cursor-pointer"
                         onClick={(e) => {
                           e.preventDefault();
                           handleLogin("RD");
                         }}
                       >
                         Registered Dietitian (RD){" "}
                       </a>
                     </div>
                     <div>
                       <a
                         className="cursor-pointer"
                         onClick={(e) => {
                           e.preventDefault();
                           handleLogin("NP");
                         }}
                       >
                         Nurse Practitioner (NP)
                       </a>
                     </div>
                     <div className="flex items-center justify-center">
                       {showSpinner ? <Spinner /> : ""}
                     </div>
                   </p>
                 </div>
                 {/*footer*/}
                 <div className="flex items-center justify-end p-6 border-t border-solid border-stone-200 rounded-b">
                   <button
                     className="bg-amber-500/90 hover:bg-amber-400 py-2 px-3 md:py-3 md:px-4 text-sm md:text-md text-white rounded-full font-bold border focus:outline-none focus:border-amber-600"
                     type="button"
                     onClick={() => setShowBypassModal(false)}
                   >
                     Close
                   </button>
                 </div>
               </div>
             </div>
           </div>
           <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
         </>
       ) : null}
     </>
   );
}

export default BypassLoginModal