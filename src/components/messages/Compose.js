import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchIt } from "../auth/fetchIt";
import { add } from "../../assets";
import NavBar from '../nav/NavBar'
import { toBeChecked } from '@testing-library/jest-dom/dist/matchers';

const formattedDate = (date) => {
    const myDate = date

    let year = myDate.toLocaleString("default", { year: "numeric" })
    let month = myDate.toLocaleString("default", { month: "2-digit" })
    let day = myDate.toLocaleString("default", { day: "2-digit" })
    const formattedDate = year + "-" + month + "-" + day
    return formattedDate
}

const Compose = () => {
const [employees, setEmployees] = useState([])
const [message, setMessage] = useState({subject:"", message_body:""})



//get all employees and add an extra boolean property called checked to control whether they are selected or not
useEffect(() => {
  fetchIt(`http://localhost:8000/employees`).then((data) => {
    const employeeData = data.map(el=>{
        return {...el, checked: false}
    })
    setEmployees(employeeData);
  });
}, []);

const handleSubmit = () =>{

  const postBody = {
    subject: message.subject,
    message_body: message.message_body,
    date_created: formattedDate(new Date()),
    read: false,
    deleted:false,
    recipients: employees.filter(el => el.checked).map(el=>el.id) //filtering the list of employees to find the ones that are checked and then getting the id of selected recipients
  }
  const address = "http://localhost:8000/messages";
  fetchIt(address, {method: "POST", body: JSON.stringify(postBody)})
  .then((data)=>{
    window.alert("Message sent")
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
                     console.log(checkedId);
                     const employeesCopy = [...employees];
                     console.log("copy", employeesCopy);
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
  // const selectedEmployeeTableRows = () => (
  //   <>
  //     <tbody>
  //       {selectedEmployees.map((el) => (
  //         <>
  //           <tr
  //             key={`table-row-${el.id}`}
  //             className="bg-white border-b dark:bg-stone-800 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-600"
  //           >
  //             <td className="w-4 p-4">
  //               <div className="flex items-center">
  //               </div>
  //             </td>
  //             <td className="px-6 py-4 text-xs">{el.role}</td>
  //             <td
  //               scope="row"
  //               className="px-6 py-4 text-xs font-medium text-stone-900 whitespace-nowrap dark:text-white"
  //             >
  //               {`${el.user.first_name.slice(0, 1)}. ${el.user.last_name}`}
  //             </td>
  //           </tr>
  //         </>
  //       ))}
  //     </tbody>
  //   </>
  // );


  return (
    <>
      <NavBar />
      <header className="flex justify-center">
        <h1 className="font-semibold text-stone-700 text-2xl mt-10 md:my-10">
          {" "}
          Compose New Message
        </h1>
      </header>
      <div className="m-auto md:border-2 rounded-md border-sky-800/30  md:pb-8 w-full md:w-1/2 mt-10">
        <div className="m-10">
          <h6 className="font-semibold text-stone-800">Select Recipient(s)</h6>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-evenly">
          <div>
            <div className=" container flex flex-col md:m-auto before:relative overflow-scroll shadow-md sm:rounded-lg md:w-full h-40 md:h-60 font-body border-solid  border-2 border-sky-600/20 py-3 px-2">
              <table className="text-md text-left text-stone-700 dark:text-stone-500">
                <thead className="text-xs text-sky-900 uppercase font-semibold bg-stone-100 dark:bg-stone-700 dark:text-stone-400">
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
          <div className="invisible">
            <button>
              <img src={add} alt="logo" className="block  w-8 md:w-10 my-6" />
            </button>
          </div>
          <div>
            <div className="invisible container flex flex-col md:m-auto before:relative overflow-scroll shadow-md sm:rounded-lg md:w-full h-40 md:h-60 font-body border-solid  border-2 border-sky-600/20 py-3 px-2">
              <table className="text-md text-left text-stone-700 dark:text-stone-500">
                <thead className="text-xs text-sky-900 uppercase font-semibold bg-stone-100 dark:bg-stone-700 dark:text-stone-400">
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
                {/* {selectedEmployeeTableRows()} */}
              </table>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-10 mt-5">
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
              className="border-gray-300 border-2 rounded-md text-stone-800 mt-2 w-80 md:w-full"
              value={message.subject}
              onChange={(e) => {
                const messageCopy = { ...message };
                messageCopy.subject = e.target.value;
                setMessage(messageCopy);
              }}
            ></textarea>
          </div>
        </div>
        <div className="flex  gap-2 ml-10 mt-4">
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
              cols="49"
              className="border-gray-300 border-2 rounded-md text-stone-800 mt-2 w-80 md:w-full"
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
      <div className="flex justify-center m-10  gap-16 mb-20">
        <div>
          <button
            className={
              "bg-sky-600/90 hover:bg-sky-600 py-2 px-3 md:py-3 md:px-5 text-sm md:text-md text-white rounded border border-blue focus:outline-none focus:border-black"
            }
            onClick = {handleSubmit}
          >
            SEND
          </button>
        </div>
        <div>
          <button
            className={
              "bg-amber-500/90 hover:bg-amber-400 py-2 px-3 md:py-3 md:px-4 text-sm md:text-md text-white rounded border focus:outline-none focus:border-black"
            }
            value=""
          >
            CANCEL
          </button>
        </div>
      </div>
    </>
  );
}

export default Compose