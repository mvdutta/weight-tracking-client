import React from "react";
import NavBar from "../nav/NavBar";
import { useState, useEffect } from "react";
import { fetchIt } from "../auth/fetchIt";
import { useNavigate, useParams } from "react-router-dom";

const ROLES = ["MD", "RN", "LPN", "NP"]


const formattedDateUI = (date) => {
  const myDate = date;

  let year = myDate.toLocaleString("default", { year: "numeric" });
  let month = myDate.toLocaleString("default", { month: "2-digit" });
  let day = myDate.toLocaleString("default", { day: "2-digit" });
  const formattedDateUI = month + "-" + day + "-" + year;
  return formattedDateUI;
};

//patientListWithWeights is a giant array which holds 10 objects (1 for each row of the table)
const WeightSummary = () => {
  const [patientListWithWeights, setPatientListWithWeights] = useState([]);
  const [employee, setEmployee] = useState({});
  const navigate = useNavigate();
    const { date } = useParams();

  useEffect(() => {
    const current_user = localStorage.getItem("wt_token");
    const parsedUser = JSON.parse(current_user);
    if (!ROLES.includes(parsedUser.role)) {
      //Check that they have the right role
      navigate("/noaccess");
    }
    setEmployee(parsedUser);
  }, []);

  useEffect(() => {
    const API2 = `http://localhost:8000/weightsheets/detailedview_rd?date=${date}`;
         const API3 = `http://localhost:8000/weights/closestdate_all?lookback=1week&date=${date}`;

    //this function makes 3 api calls sequentially
    const getData = async () => {
      const weightsheets = await fetchIt(API2);
      const previousWeights = await fetchIt(API3);
      //join the wt sheet table with the table of previous wts by resident id
      for (let entry of weightsheets) {
        const previousWeights_entry = previousWeights.find(
          (el) => el.resident_id === entry.resident_id
        );
        entry.prev_wt = previousWeights_entry.weight;
      }
      setPatientListWithWeights(weightsheets);
    };
    getData();
  }, []);

  const checkboxstyle =
    "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500";

  

  const makeTableRows = () => {
    const filledWeightRows =
      patientListWithWeights.length > 0
        ? patientListWithWeights.map((el, index) => (
            <tr key={`table-row-${el.resident_id}`}>
              <td className="border px-8 py-4">{el.room_num}</td>
              <td className="border px-8 py-4">
                {el.first_name} {el.last_name}
              </td>
              <td className="border text-center py-4">
                {el.weight || ""}
              </td>
              <td className="border py-4 text-center">{el.prev_wt}</td>
              <td className="border py-4 text-center ">
                <input
                  disabled
                  type="checkbox"
                  className={checkboxstyle}
                  checked={el.reweighed}
                  value={el.reweighed}
                  id={`put--${index}--reweighed`}
                />
              </td>
              <td className="border text-center flex justify-center py-4">
                <div className="flex flex-col items-start">
                  <div className="flex items-center justify-center mb-4">
                    <input
                      disabled
                      type="checkbox"
                      className={checkboxstyle}
                      checked={el.not_in_room}
                      value={el.not_in_room}
                      id={`put--${index}--not_in_room`}

                    />
                    <label
                      htmlFor="default-radio-1"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Absent
                    </label>
                  </div>
                  <div className="flex items-center justify-center">
                    <input
                      disabled
                      type="checkbox"
                      className={checkboxstyle}
                      checked={el.refused}
                      value={el.refused}
                      id={`put--${index}--refused`}
                    />
                    <label
                      htmlFor="default-radio-2"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Refused
                    </label>
                  </div>
                </div>
              </td>
              <td className="border px-8 py-4">
                <select
                  disabled={el.final}
                  id={`put--${index}--scale_type`}
                  className="flex bg-gray-50 -z-50 border border-separate border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={el.scale_type}
                >
                  <option value="">Select</option>
                  <option value="floor">Floor</option>
                  <option value="wheelchair">Wheelchair</option>
                  <option value="chair">Chair</option>
                  <option value="bed">Bed</option>
                </select>
              </td>
              <td className="border text-center py-4">
                <input
                  disabled
                  type="checkbox"
                  className={checkboxstyle}
                  checked={el.daily_wts}
                  value={el.daily_wts}
                  id={`put--${index}--daily_wts`}
                />
              </td>
            </tr>
          ))
        : [];

    return <tbody>{filledWeightRows}</tbody>;
  };

  return (
    <div>
      <NavBar />

      <header className="flex justify-center">
        <h1 className="font-semibold text-stone-700 text-2xl mt-8 mb-20">
          {" "}
          Weekly Weight Summary
        </h1>
      </header>
      <div className="container mx-auto flex flex-col mt-20 mb-20">
        <div className="mb-10 ml-2 text-md sm:text-lg">
          <span>Date: {date}</span>
        </div>
        <table className="shadow-md shadow-stone-300 bg-sky-50/40 border-separate overflow-x-auto">
          <thead>
            <tr className="font-body text-stone-800">
              <th className="bg-sky-600/20 border text-left px-8 py-4">Room</th>
              <th className="bg-sky-600/20 border text-left px-8 py-4">
                Resident Name
              </th>
              <th className="bg-sky-600/20 border text-left px-8 py-4">
                Current Weight
              </th>
              <th className="bg-sky-600/20 border text-left px-8 py-4">
                Previous Weight
              </th>
              <th className="bg-sky-600/20 border text-left px-8 py-4">
                ReWeighed?
              </th>
              <th className="bg-sky-600/20 border text-left px-8 py-4">
                Absent or Refused
              </th>
              <th className="bg-sky-600/20 border text-left px-12 lg:px-8 py-4">
                Scale Type
              </th>
              <th className="bg-sky-600/20 border text-left px-8 py-4">
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

export default WeightSummary;
