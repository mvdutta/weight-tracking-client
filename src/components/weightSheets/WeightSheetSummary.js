import React from "react"
import NavBar from "../nav/NavBar"
import { useState, useEffect } from "react"
import { fetchIt } from "../auth/fetchIt"
import { useNavigate, useParams } from "react-router-dom";
import "./WeightSheets.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formattedDateUI } from "../utilities/FormattedDate";


const WeightSheetSummary = () => {
    const [patientListWithWeights, setPatientListWithWeights] = useState([])
    const [employee, setEmployee] = useState({})
    const [alerts, showAlerts] = useState(false)
    const navigate = useNavigate()
    const { date } = useParams();
    const MySwal = withReactContent(Swal);
    const [finalized, setFinalized] = useState(true)


    useEffect(() => {
        const current_user = localStorage.getItem("wt_token")
        const parsedUser = JSON.parse(current_user)
        if (parsedUser.role !== "RD") {
            //Check that they have the right role
            navigate("/noaccess")
        }
        setEmployee(parsedUser)
    }, [])

    useEffect(()=>{
        const dates_api = "http://localhost:8000/weightsheets/dates";
        const API1 = "http://localhost:8000/weightsheets/create_all_weightsheets"
        const API2 = `http://localhost:8000/weightsheets/detailedview_rd?date=${date}`
        const API3 = `http://localhost:8000/weights/closestdate_all?lookback=1week&date=${date}`;

        const getData =  async () =>{
            const { dates } = await fetchIt(dates_api); 
            if (!dates.includes(date)) {
              await fetchIt(API1, {
                method: "POST",
                body: JSON.stringify({ date: date }),
              });
            }
            const weightsheets = await fetchIt(API2)
            const previousWeights = await fetchIt(API3)
            for (let entry of weightsheets) {
                    const previousWeights_entry = previousWeights.find(
                        (el) => el.resident_id === entry.resident_id
                    )
                    entry.prev_wt = previousWeights_entry.weight
                }
            setPatientListWithWeights(weightsheets)
            setFinalized(weightsheets.every((el) => el.final));
        }
        getData()

    },[finalized])
    const checkBoxStyle =
        "w-4 h-4 text-blue-600 bg-stone-100 border-stone-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-stone-700 dark:focus:ring-offset-stone-700 focus:ring-2 dark:bg-stone-600 dark:border-stone-500"

    // const CheckFinalized = () => patientListWithWeights.every(el=>el.final)

    const handleSubmit = () => {
         Swal.fire({
           title: `Are you sure?`,
           text: 'Finalized values cannot be changed!',
           icon: "warning",
           iconColor: "#925631",
           showCancelButton: true,
           confirmButtonColor: "#DAA520",
           cancelButtonColor: "#0284c7",
           confirmButtonText: "Finalize",
           customClass: "final-warning",
           showClass: {
             popup: "animate__animated animate__fadeInDown",
           },
           hideClass: {
             popup: "animate__animated animate__fadeOutUp",
           },
         }).then((result) => {
           if (result.isConfirmed) {
            const address =
              "http://localhost:8000/weightsheets/save_weightsheets";
            const requestBody = {
                date: date
            }
            fetchIt(address, {
            method: "PUT",
            body: JSON.stringify(requestBody),
            }).then(()=>{
                navigate(0)
            })
           }
         });
        
    }

    const handleChange = (e) => {
        const [type, index, field] = e.target.id.split("--")
        const copy = [...patientListWithWeights]
 
        if (field === "weight") {
            copy[index][field] = parseFloat(e.target.value)
        }
        if (field === "reweighed" || field === "daily_wts") {
            copy[index][field] = !copy[index][field]
        }
        if (field === "not_in_room") {
            copy[index][field] = !copy[index][field]
            if (copy[index][field]) {
                copy[index]["refused"] = false
            }
        }
        if (field === "refused") {
            copy[index][field] = !copy[index][field]
            if (copy[index][field]) {
                copy[index]["not_in_room"] = false
            }
        }
        if (field === "scale_type") {
            copy[index][field] = e.target.value
        }
        setPatientListWithWeights(copy)
    }

      const handleSave = () => {
        //prepare post requests
        const API = "http://localhost:8000";
        const promiseArray = [];
        if (patientListWithWeights.length > 0) {
          for (let el of patientListWithWeights) {
            const address = `${API}/weightsheets/${el.weight_sheet_id}`;
            const requestBody = {
              resident: el.resident_id,
              reweighed: el.reweighed,
              refused: el.refused,
              not_in_room: el.not_in_room,
              daily_wts: el.daily_wts,
              show_alert: el.show_alert,
              scale_type: el.scale_type,
              final: el.final,
              weight: el.weight,
            };
            promiseArray.push(
              fetchIt(address, {
                method: "PUT",
                body: JSON.stringify(requestBody),
              })
            );
          }
          for (let el of patientListWithWeights) {
            const address = `${API}/weights/${el.weight_id}`;
            const requestBody = {
              resident: el.resident_id,
              date: date,
              weight: el.weight,
            };
            promiseArray.push(
              fetchIt(address, {
                method: "PUT",
                body: JSON.stringify(requestBody),
              })
            );
          }
        }

        if (promiseArray.length > 0) {
          Promise.any(promiseArray).then(() => {
             MySwal.fire({
               title: "Data Saved",
               confirmButtonColor: "#DAA520",
               customClass: "sweet-warning",
               showClass: {
                 popup: "animate__animated animate__fadeInDown",
               },
               hideClass: {
                 popup: "animate__animated animate__fadeOutUp",
               },
             });
          });
        }
      };
    const makeTableRows = () => {
        const filledWeightRows =
          patientListWithWeights.length > 0
            ? patientListWithWeights.map((el, index) => (
                <tr
                  key={`table-row-${el.resident_id}`}
                  className={
                    el.weight === 0 ||
                    el.weight === "" ||
                    Math.abs(el.weight - el.prev_wt) > 5 ||
                    el.not_in_room ||
                    el.refused
                      ? "bg-amber-400/40"
                      : ""
                  }
                >
                  <td className="border px-8 py-4">{el.room_num}</td>
                  <td className="border px-8 py-4">
                    {el.first_name} {el.last_name}
                  </td>
                  <td className="border text-center py-4">
                    <input
                      disabled={el.final}
                      type="Number"
                      className="w-1/2 bg-stone-50 border border-stone-300"
                      value={el.weight || ""}
                      id={`put--${index}--weight`}
                      onChange={(e) => handleChange(e)}
                    />
                  </td>
                  <td className="border text-center py-4">{el.prev_wt}</td>
                  <td className="border text-center py-4">
                    <input
                      disabled={el.final}
                      type="checkbox"
                      className={checkBoxStyle}
                      checked={el.reweighed}
                      value={el.reweighed}
                      id={`put--${index}--reweighed`}
                      onChange={(e) => handleChange(e)}
                    />
                  </td>
                  <td className="border text-center flex justify-center py-4">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-4">
                        <input
                          disabled={el.final}
                          type="checkbox"
                          className={checkBoxStyle}
                          checked={el.not_in_room}
                          value={el.not_in_room}
                          id={`put--${index}--not_in_room`}
                          onChange={(e) => handleChange(e)}
                        />
                        <label
                          htmlFor="default-radio-1"
                          className="ml-2 text-sm font-medium text-stone-900 dark:text-stone-300"
                        >
                          Absent
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          disabled={el.final}
                          type="checkbox"
                          className={checkBoxStyle}
                          checked={el.refused}
                          value={el.refused}
                          id={`put--${index}--refused`}
                          onChange={(e) => handleChange(e)}
                        />
                        <label
                          htmlFor="default-radio-2"
                          className="ml-2 text-sm font-medium text-stone-900 dark:text-stone-300"
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
                      className="flex bg-stone-50 border border-separate border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full  dark:bg-stone-700 dark:border-stone-600 dark:placeholder-stone-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={el.scale_type}
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="">Select</option>
                      <option value="floor">Floor</option>
                      <option value="wheelchair">Wheelchair</option>
                      <option value="chair">Chair</option>
                      <option value="bed">Bed</option>
                    </select>
                  </td>
                  <td className="border px-8 py-4">
                    <input
                      disabled={el.final}
                      type="checkbox"
                      className={checkBoxStyle}
                      checked={el.daily_wts}
                      value={el.daily_wts}
                      id={`put--${index}--daily_wts`}
                      onChange={(e) => handleChange(e)}
                    />
                  </td>
                </tr>
              ))
            : [];
        
        return (
            <tbody>
                {filledWeightRows}
            </tbody>
        )
    }

    return (
      <div>
        <NavBar />
        <header className="flex justify-center">
          <h1 className="font-semibold text-stone-700 text-2xl mt-8 mb-20">
            {" "}
            Weekly Weight Sheet
          </h1>
        </header>
        <div className="container mx-auto flex flex-col">
          <div className="flex justify-between content-center items-center text-md sm:text-lg mx-10">
            <span>Date: {formattedDateUI(date)}</span>
            <div className="flex justify-center sm:gap-20 gap-10 my-10">
              <button
                className={finalized?"hidden":`bg-amber-500/80 hover:bg-amber-400 w-24 py-3 mb-3 text-sm font-bold uppercase text-white rounded-full border shadow border-amber focus:outline-none focus:border-amber-600 `}
                value="Finalize"
                onClick={handleSubmit}
              >
                Finalize
              </button>
              <button
                className={finalized?"hidden":"bg-sky-600/80 hover:bg-sky-400 w-24 mb-3 text-sm font-bold uppercase text-white rounded-full border shadow border-blue focus:outline-none focus:border-sky-500"}
                disabled={finalized}
                value="Save"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
          <table className="shadow-md shadow-stone-300  bg-sky-50/40 border-separate overflow-scroll">
            <thead>
              <tr className=" font-body text-stone-800">
                <th className="bg-sky-600/20 border text-left px-8 py-4">
                  Room
                </th>
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
        <div className="flex justify-center gap-20 my-10">
          <button
            className={finalized?"hidden":"bg-amber-500/80 hover:bg-amber-400 w-24 py-3 mb-3 text-sm font-bold uppercase text-white rounded-full border border-amber focus:outline-none focus:border-black"}
            value="Finalize"
            onClick={handleSubmit}
          >
            Finalize
          </button>
          <button
            className={finalized?"hidden":"bg-sky-600/80 hover:bg-sky-400 w-24 mb-3 text-sm font-bold uppercase text-white rounded-full border shadow border-blue focus:outline-none focus:border-black"}
            value="Save"
            disabled={finalized}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    );
}

export default WeightSheetSummary
