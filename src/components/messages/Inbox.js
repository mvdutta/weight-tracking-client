import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchIt } from "../auth/fetchIt";
import NavBar from '../nav/NavBar'
import { discard, compose } from "../../assets";


const formattedDate = (date) => {
  const myDate = date;

  let year = myDate.toLocaleString("default", { year: "numeric" });
  let month = myDate.toLocaleString("default", { month: "2-digit" });
  let day = myDate.toLocaleString("default", { day: "2-digit" });
  const formattedDate = month + "-" + day + "-" + year;
  return formattedDate;
};


const Inbox = () => {
   const navigate = useNavigate();
   const [name, setName] = useState("");
   const [user, setUser] = useState({});
   const [loggedIn, setLoggedIn] = useState(false);
   const [emails, setEmails] = useState([])


  useEffect(() => {
    const user = localStorage.getItem("wt_token");
    if (user) {
      const parsedUser = JSON.parse(user);
      setName(parsedUser.name);
      setUser(parsedUser)
      console.log(parsedUser)
    fetchIt(`http://localhost:8000/employeemessages?recipient=${parsedUser.id}`)
        .then((data) => {
          setEmails(data);
        });
    }
  }, [loggedIn]);

  const deleteEmail = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this email?"
    );
    if (!confirmed) return;
    console.log(id)
    fetchIt(`http://localhost:8000/employeemessages/${id}`, {
      method: "DELETE",
    }).then(() => {
      navigate(0); //refreshes the page
    });
  };

 const makeTableRows = () => (
   <>
     <tbody>
       {emails.map((el) => (
         <>
           <tr
             key={`table-row-${el.id}`}
             className="bg-white border-b dark:bg-stone-800 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-600"
           >
             <td
               scope="row"
               className="px-6 py-4 font-medium text-stone-900 whitespace-nowrap dark:text-white"
             >
               {`${el.sender.user.first_name.slice(0, 1)}. ${
                 el.sender.user.last_name
               }`}
             </td>
             <td className="px-6 py-4">{el.message.subject}</td>
             <td className="px-6 py-4">
               {formattedDate(new Date(el.message.date_created))}
             </td>
             <td className="px-6 py-4">
               {
                 <img
                   src={discard}
                   alt="logo"
                   id= {`delete--${el.id}`}
                   className="block w-28 md:w-6 cursor-pointer"
                   onClick={(evt) => {
                    const[_, id] = evt.target.id.split("--")
                    console.log("ID:", id)
                     deleteEmail(id);
                   }}
                 />
               }
             </td>
           </tr>
         </>
       ))}
     </tbody>
   </>
 );


  return (
    <>
      <NavBar />
      <div className=" container justify-center m-auto w-2/3">
        <header className="flex justify-center">
          <h1 className="font-semibold text-stone-700 text-2xl my-8"> Inbox</h1>
        </header>
        <div className="text-center md:mt-5 mb-10">
          <h1 className="text-xl font-semibold text-stone-600">
            {name ? `Welcome ${name}` : ""}
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-2 justify-center md:justify-start md:ml-40 mt-5 mb-10 md:mb-18 text-stone-700">
          <img src={compose} alt="logo" className="block  w-8 md:w-14" />
          <h3>
            {" "}
            <Link to="/compose">
              <span className="text-stone-700 underline">
                Compose New Message
              </span>
            </Link>
          </h3>
        </div>
        <div className=" container flex flex-col md:m-auto before:relative overflow-auto shadow-md sm:rounded-lg md:w-2/3 font-body border-solid  border-2 border-sky-600/20 py-6 px-4">
          <table className="text-md text-center text-stone-700 dark:text-stone-500">
            <thead className="text-sm text-sky-900 uppercase font-semibold bg-stone-100 dark:bg-stone-700 dark:text-stone-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Sender
                </th>
                <th scope="col" className="px-6 py-3">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            {makeTableRows()}
          </table>
        </div>
      </div>
    </>
  );
}

export default Inbox