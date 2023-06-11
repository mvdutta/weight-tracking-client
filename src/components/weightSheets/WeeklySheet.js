import React from "react"
import NavBar from "../nav/NavBar"
import { useState, useEffect } from "react"
import { fetchIt } from "../auth/fetchIt"
import { useNavigate,  useParams } from "react-router-dom"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formattedDateUI } from "../utilities/FormattedDate"
import { getAPIroot } from "../utilities/getAPIroot"
import Spinner from "../utilities/Spinner"

const APIROOT = getAPIroot()

//patientListWithWeights is a giant array which holds 10 objects (1 for each row of the table) 
const WeeklySheet = () => {
    const [patientListWithWeights, setPatientListWithWeights] = useState([])
    const [employee, setEmployee] = useState({})
    const [finalized, setFinalized] = useState(false)
    const navigate = useNavigate()
    const { date } = useParams();
    const MySwal = withReactContent(Swal);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const current_user = localStorage.getItem("wt_token")
        const parsedUser = JSON.parse(current_user)
        if (parsedUser.role !== "CNA") {
            //Check that they have the right role
            navigate("/noaccess")
        }
        setEmployee(parsedUser)
    }, [])


    useEffect(()=>{
        const dates_api = `${APIROOT}weightsheets/dates`
        const API1 = `${APIROOT}weightsheets/create_all_weightsheets`
        const API2 = `${APIROOT}weightsheets/detailedview_rd?date=${date}`
        const API3 =
          `${APIROOT}weights/closestdate_all?lookback=1week&date=${date}`;

        //this function makes 3 api calls sequentially 
        const getData =  async () =>{
          setShowSpinner(true)
            const {dates} = await fetchIt(dates_api) //get all the dates for which weightsheets exist and create new weightsheets only if one doesn't exists
            if (!dates.includes(date)){
            await   fetchIt(API1, {
                        method: "POST",
                        body: JSON.stringify({date: date}),
                    })
                }
            const weightsheets = await fetchIt(API2)
            const previousWeights = await fetchIt(API3)
            //join the wt sheet table with the table of previous wts by resident id
            for (let entry of weightsheets) {
                    const previousWeights_entry = previousWeights.find(
                        (el) => el.resident_id === entry.resident_id
                    )
                    entry.prev_wt = previousWeights_entry.weight
                }
            weightsheets.sort((x,y)=>x.room_num-y.room_num)//sort the weight sheets by room number
            setPatientListWithWeights(weightsheets)
            setFinalized(weightsheets.every(el=>el.final))
            setShowSpinner(false)
        }
        getData()

    },[])

    const checkBoxStyle =
        "w-4 h-4 text-blue-600 bg-stone-100 border-stone-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-stone-700 dark:focus:ring-offset-stone-700 focus:ring-2 dark:bg-stone-600 dark:border-stone-500"

    const handleSubmit = () => {
        //prepare post requests
        const promiseArray = []
        if (patientListWithWeights.length>0){
        for (let el of patientListWithWeights) {
            const address = `${APIROOT}weightsheets/${el.weight_sheet_id}`
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
            }
            promiseArray.push(
                fetchIt(address, {
                    method: "PUT",
                    body: JSON.stringify(requestBody),
                })
            )
        }
        for (let el of patientListWithWeights) {
            const address = `${APIROOT}weights/${el.weight_id}`
            const requestBody = {
                resident: el.resident_id,
                date: date,
                weight: el.weight,
            }
            promiseArray.push(
                fetchIt(address, {
                    method: "PUT",
                    body: JSON.stringify(requestBody),
                })
            )
        }
    }
    
        if (promiseArray.length>0) {
            Promise.any(promiseArray).then((data) => {
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
        
    }

    const handleChange = (e) => {
        const [type, index, field] = e.target.id.split("--")
        const copy = [...patientListWithWeights]
        if (field === "weight") {
            copy[index][field] = parseFloat(e.target.value)
        }
        if (field === "reweighed" || field === "daily_wts") {
            copy[index][field] = !copy[index][field]//toggles the value from true to false and vice versa
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
                    <input
                      //if the final property is true, then disabled will = true and the button can't be clicked
                      disabled={el.final}
                      type="Number"
                      className=" bg-stone-50 border w-1/2 border-stone-300"
                      value={el.weight || ""}
                      id={`put--${index}--weight`}
                      onChange={(e) => handleChange(e)}
                    />
                  </td>
                   <td className="border text-center py-4">{el.prev_wt && el.prev_wt>0? el.prev_wt:"N/A"}</td>
                  <td className="border py-4 text-center ">
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
                      <div className="flex items-center justify-center mb-4">
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
                      <div className="flex items-center justify-center">
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
                  <td className="border text-center py-4">
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
          <h1 className="font-semibold text-stone-700 text-3xl mt-8 mb-20">
            {" "}
            Weekly Weight Sheet
          </h1>
        </header>
        <div className="flex flex-col rounded-md items-center m-auto border-2 shadow-md border-stone-200/60 sm:w-[600px] lg:w-1/3 py-3 px-5 md:px-10 text-smoke-600 shadow-stone-900/30">
          <ol>
            <li className="font-semibold">Goals:</li>
            <li>
              1. Weigh every resident and fill in the form every Tuesday by 5:00
              pm
            </li>
            <li>2. Make and save changes as needed</li>
            <li>
              3. If CBW is +/- 5lbs. from PBW, reweigh the resident to confirm
            </li>
            <li>4. Message dietitian or RN with questions/concerns</li>
          </ol>
        </div>

        <div className="container mx-auto flex flex-col mt-20 overflow-auto">
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-0 sm:justify-around mx-5 sm:mx-10 mb-8 content-center items-center text-md sm:text-lg overflow-auto">
            <span>Weight Team Member: {employee.name}</span>
            <span className="text-md">Date: {formattedDateUI(date)}</span>
            <button
              className={
                finalized
                  ? "hidden"
                  : "bg-sky-600 hover:bg-sky-500 uppercase text-sm py-2 px-6 mb-2 text-white font-bold rounded-full border border-blue focus:outline-none focus:border-sky-700 shadow-md "
              }
              value=""
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
          <table className="shadow-md shadow-stone-300 bg-sky-50/40 border-separate overflow-scroll">
            <thead>
              <tr className="font-body text-stone-800">
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
        <div className="my-10 flex justify-center">
          {showSpinner ? <Spinner /> : ""}
        </div>
        <div className="my-10 flex justify-center">
          <button
            className={
              finalized
                ? "hidden"
                : "bg-sky-600 hover:bg-sky-500 uppercase text-md py-2 px-6 text-white font-bold rounded-full border border-blue focus:outline-none focus:border-sky-700 shadow-md"
            }
            value=""
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    );
}

export default WeeklySheet
