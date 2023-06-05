import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchIt } from "../auth/fetchIt";
import { add } from "../../assets";
import NavBar from '../nav/NavBar'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getAPIroot } from '../utilities/getAPIroot';

const formattedDate = (date) => {
    const myDate = date

    let year = myDate.toLocaleString("default", { year: "numeric" })
    let month = myDate.toLocaleString("default", { month: "2-digit" })
    let day = myDate.toLocaleString("default", { day: "2-digit" })
    const formattedDate = year + "-" + month + "-" + day
    return formattedDate
}

const APIROOT = getAPIroot()

const Compose = () => {
const [employees, setEmployees] = useState([])
const [message, setMessage] = useState({subject:"", message_body:""})
const MySwal = withReactContent(Swal);



//get all employees and add an extra boolean property called checked to control whether they are selected or not
useEffect(() => {
  fetchIt(`${APIROOT}employees`).then((data) => {
    const employeeData = data.map(el=>{
        return {...el, checked: false}
    })
    setEmployees(employeeData);
  });
}, []);

const clearMessage = () => {
  const messageCopy = { ...message };
  messageCopy.message_body = "";
  messageCopy.subject = ""
  setMessage(messageCopy);

}

const handleSubmit = () =>{
  if(message.subject === "") {
        MySwal.fire({
          title: "Please enter a subject",
          confirmButtonColor: "#DAA520",
          customClass: "sweet-warning",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
    return
  }
    if (message.message_body === "") {
          MySwal.fire({
            title: "Please enter a message",
            confirmButtonColor: "#DAA520",
            customClass: "sweet-warning",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          });
      return;
    }
  const postBody = {
    subject: message.subject,
    message_body: message.message_body,
    date_created: formattedDate(new Date()),
    read: false,
    deleted:false,
    recipients: employees.filter(el => el.checked).map(el=>el.id) //filtering the list of employees to find the ones that are checked and then getting the id of selected recipients
  }
  const address = `${APIROOT}messages`;
  fetchIt(address, {method: "POST", body: JSON.stringify(postBody)})
  .then((data)=>{
     MySwal.fire({
       title: "Message Sent",
       confirmButtonColor: "#DAA520",
       customClass: "sweet-warning",
       showClass: {
         popup: "animate__animated animate__fadeInDown",
       },
       hideClass: {
         popup: "animate__animated animate__fadeOutUp",
       },
     });
     clearMessage()
  })
}
  

 const employeeTableRows = () => (
   <>
     <tbody>
       {employees.map((el) => (
         <>
           <tr
             key={`table-row-${el.id}`}
             className="bg-white border-b dark:bg-stone-800 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-600"
           >
             <td key={`table-cell1-${el.id}`} className="w-4 p-4">
               <div className="flex items-center">
                 <input
                   id={`recipient--${el.id}`}
                   type="checkbox"
                   checked={el.checked}
                   onChange={(e) => {
                     const [_, checkedId] = e.target.id.split("--");
                     const employeesCopy = [...employees];
                     const rec = employeesCopy.find(
                       (emp) => emp.id === +checkedId
                     );
                     rec.checked = !rec.checked;
                     setEmployees(employeesCopy);
                   }}
                   className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                 />
                 <label for="checkbox-table-1" className="sr-only">
                   checkbox
                 </label>
               </div>
             </td>
             <td key={`table-cell2-${el.id}`}  className="px-6 py-4 text-xs">
               {el.role}
             </td>
             <td
               scope="row"
               className="px-6 py-4 text-xs text-stone-900 whitespace-nowrap dark:text-white"
             >
               {`${el.user.first_name.slice(0, 1)}. ${el.user.last_name}`}
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
      <header className="flex justify-center">
        <h1 className="font-semibold text-stone-700 text-3xl mt-10 md:my-10">
          {" "}
          Compose New Message
        </h1>
      </header>
      <div className="flex justify-center">
        <div className=" md:border-2 rounded-md shadow-md shadow-sky-800/40 border-sky-800/30 md:pb-8 px-10 mt-10 inline-block content-center">
          <div className="mt-5">
            <h6 className="font-semibold text-stone-800">
              Select Recipient(s):
            </h6>
          </div>
          <div className="flex flex-col md:flex-row justify-center mt-5 ml-[74px]">
            <div>
              <div className=" container flex before:relative overflow-scroll shadow-md sm:rounded-lg h-40 md:h-60 w-[320px] font-body border-solid  border-2 border-sky-600/20 py-3 px-2">
                <table className="text-md text-left m-auto w-full text-stone-700 dark:text-stone-500">
                  <thead className="text-sm text-sky-900 uppercase font-semibold bg-stone-100 dark:bg-stone-700 dark:text-stone-400">
                    <tr>
                      <th scope="col" class="p-4">
                        <div></div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                    </tr>
                  </thead>
                  {employeeTableRows()}
                </table>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-5">
            <div className="">
              <label className="font-semibold text-stone-800" for="subject">
                Subject:
              </label>
            </div>
            <div>
              <textarea
                id=""
                name=""
                rows="1"
                cols="49"
                className="border-gray-300 border-2 rounded-md text-stone-800 mt-2 w-80"
                value={message.subject}
                onChange={(e) => {
                  const messageCopy = { ...message };
                  messageCopy.subject = e.target.value;
                  setMessage(messageCopy);
                }}
              ></textarea>
            </div>
          </div>
          <div className="flex  gap-2 mt-4">
            <div className="">
              <label className="font-semibold text-stone-800" for="subject">
                Message:
              </label>
            </div>
            <div>
              <textarea
                id=""
                name=""
                rows="4"
                cols=""
                className="border-gray-300 border-2 rounded-md text-stone-800 mt-2 w-80"
                value={message.message_body}
                onChange={(e) => {
                  const messageCopy = { ...message };
                  messageCopy.message_body = e.target.value;
                  setMessage(messageCopy);
                }}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-10 gap-16 mb-20">
        <div>
          <button
            className={
              "bg-sky-600/90 hover:bg-sky-600 py-2 px-5 md:py-3 md:px-6 text-sm md:text-md text-white rounded-full font-bold border border-blue focus:outline-none focus:border-sky-700"
            }
            onClick= {handleSubmit}
          >
            SEND
          </button>
        </div>
        <div>
          <Link to="/inbox">
            <button
              className={
                "bg-amber-500/90 hover:bg-amber-400 py-2 px-3 md:py-3 md:px-4 text-sm md:text-md text-white font-bold rounded-full border focus:outline-none focus:border-amber-500"
              }
              value=""
            >
              CANCEL
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Compose