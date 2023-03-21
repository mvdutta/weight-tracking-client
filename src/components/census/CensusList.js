import React from "react";
import NavBar from "../nav/NavBar";
import { useState, useEffect } from "react";
import { fetchIt } from "../auth/fetchIt";
import "./Censuslist.css";

const formattedDate = (date) => {
  const myDate = date;

  let year = myDate.toLocaleString("default", { year: "numeric" });
  let month = myDate.toLocaleString("default", { month: "2-digit" });
  let day = myDate.toLocaleString("default", { day: "2-digit" });
  const formattedDate = month + "-" + day + "-" + year;
  return formattedDate;
};

export const CensusList = () => {
  const [residentList, setResidentList] = useState([]);

useEffect(() => {
  fetchIt(`http://localhost:8000/residents`)
    .then((data) => {
      setResidentList(data);
    });
}, []);
  

  const makeTableRows = () => (
    <>
      <tbody>
        {residentList.map((el) => (
          <>
            <tr
              key={`table-row-${el.id}`}
              className="bg-white border-b dark:bg-stone-800 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-600"
            >
              <td
                scope="row"
                className="px-6 py-4 font-medium text-stone-900 whitespace-nowrap dark:text-white"
              >
                {el.room_num}
              </td>
              <td className="px-6 py-4">
                {el.last_name}, {el.first_name}
              </td>
              <td className="px-6 py-4">{el.admission_date}</td>
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
        <h1 className="font-semibold text-stone-700 text-2xl my-8 md:mb-32">
          {" "}
          Current Census List
        </h1>
      </header>
      <div className=" container flex flex-col md:m-auto before:relative overflow-auto shadow-md sm:rounded-lg md:w-1/2 font-body border-solid  border-2 border-sky-600/20 py-6 px-4">
        <table className="text-md text-center text-stone-700 dark:text-stone-500">
          <caption className="p-5 text-lg font-semibold text-sky-900 bg-white dark:text-white dark:bg-gray-800 text-center">
            Gaffney Scranton Rehabilitation & Healing
            <p className="mt-1 text-md font-normal text-stone-700 dark:text-stone-400">
              Resident Census List
            </p>
            <p className="mt-1 text-sm font-normal text-stone-600 dark:text-stone-400">
              Accessed: {formattedDate(new Date())}
            </p>
            <p className="mt-1 text-sm font-normal text-stone-600 dark:text-stone-400">
              Current Residents ({residentList.length})
            </p>
          </caption>
          <thead className="text-sm text-sky-900 uppercase font-semibold bg-stone-100 dark:bg-stone-700 dark:text-stone-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Room Number
              </th>
              <th scope="col" className="px-6 py-3">
                Resident's Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Admission Date
              </th>
            </tr>
          </thead>
          {makeTableRows()}
        </table>
      </div>
    </>
  );
};
