import React from "react";
import NavBar from "../nav/NavBar";
import { useState, useEffect } from "react";
import { fetchIt } from "../auth/fetchIt";

const formattedDate = (date) => {
  const myDate = date;

  let year = myDate.toLocaleString("default", { year: "numeric" });
  let month = myDate.toLocaleString("default", { month: "2-digit" });
  let day = myDate.toLocaleString("default", { day: "2-digit" });
  // let daylong = myDate.toLocaleString("default", { weekday: 'long',})
  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
};

const WeeklySheet = () => {
  const [patientList, setPatientList] = useState([]);

  useEffect(() => {
    const API = "http://localhost:8000/residents";
    fetchIt(API).then((data) => {
      console.log(data);
      setPatientList(data);
    });
  }, []);

  const makeTableRows = () => (
    <tbody>
      {patientList.map((el) => (
        <tr key={`table-row-${el.id}`}>
          <td className="border px-8 py-4">{el.room_num}</td>
          <td className="border px-8 py-4">
            {el.first_name} {el.last_name}
          </td>
          <td className="border px-8 py-4">
            <input
              type="Number"
              className="w-{1/3} bg-gray-50 border border-gray-300"
            />
          </td>
          <td className="border px-8 py-4">232</td>
          <td className="border px-8 py-4">
            <input type="checkbox" />
          </td>
          <td className="border px-8 py-4">
            <input type="checkbox" />
          </td>
          <td className="border px-8 py-4">
            <select
              id="scaletypes"
              className="flex bg-gray-50 border border-separate border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="floor">Floor</option>
              <option value="wheelchair">Wheelchair</option>
              <option value="chair">Chair</option>
              <option value="bed">Bed</option>
            </select>
          </td>
          <td className="border px-8 py-4">
            <input type="checkbox" />
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div>
      <NavBar />

      <div className="container mx-auto flex flex-col">
        <table className="shadow-lg bg-white border-separate overflow-scroll">
          <thead>
            <tr>
              <th className="bg-blue-100 border text-left px-8 py-4">Room #</th>
              <th className="bg-blue-100 border text-left px-8 py-4">
                Resident Name
              </th>
              <th className="bg-blue-100 border text-left px-8 py-4">
                Current Weight
              </th>
              <th className="bg-blue-100 border text-left px-8 py-4">
                Previous Weight
              </th>
              <th className="bg-blue-100 border text-left px-8 py-4">
                ReWeighed?
              </th>
              <th className="bg-blue-100 border text-left px-8 py-4">
                Absent or Refused
              </th>
              <th className="bg-blue-100 border text-left px-8 py-4">
                Scale Type
              </th>
              <th className="bg-blue-100 border text-left px-8 py-4">
                Daily Weights
              </th>
            </tr>
          </thead>
          {makeTableRows()}
        </table>
      </div>
    </div>
  );
};

export default WeeklySheet;