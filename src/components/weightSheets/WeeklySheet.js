import React from "react"
import NavBar from "../nav/NavBar"
import { useState, useEffect } from "react"
import { fetchIt } from "../auth/fetchIt"
import { useNavigate } from "react-router-dom"

const formattedDate = (date) => {
    const myDate = date

    let year = myDate.toLocaleString("default", { year: "numeric" })
    let month = myDate.toLocaleString("default", { month: "2-digit" })
    let day = myDate.toLocaleString("default", { day: "2-digit" })
    const formattedDate = year + "-" + month + "-" + day
    return formattedDate
}


const WeeklySheet = () => {
    const [patientListNoWeights, setPatientListNoWeights] = useState([])
    const [patientListWithWeights, setPatientListWithWeights] = useState([])
    const [employee, setEmployee] = useState({})
    const [alerts, showAlerts] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const current_user = localStorage.getItem("wt_token")
        const parsedUser = JSON.parse(current_user)
        if (parsedUser.role !== "CNA") {
            //Check that they have the right role
            navigate("/noaccess")
        }
        setEmployee(parsedUser)
    }, [])

    useEffect(() => {
        const todaysDate = formattedDate(new Date())
        const API1 = "http://localhost:8000/residents"
        const API2 = `http://localhost:8000/weightsheets/detailedview_rd?date=${todaysDate}`
        const API3 =
            "http://localhost:8000/weights/closestdate_all?lookback=1week"
        const p1 = fetchIt(API1)
        const p2 = fetchIt(API2)
        const p3 = fetchIt(API3)
        Promise.all([p1, p2, p3]).then((data) => {
            const [unweighed, weighed, previousWeights] = data
            let unweighedAddedFields = unweighed.map((el) => {
                return {
                    first_name: el.first_name,
                    last_name: el.last_name,
                    room_num: el.room_num,
                    resident_id: el.id,
                    weight: 0,
                    // prev_wt: previousWeights.find((prev_el) => el.id === prev_el.resident_id),
                    final: false,
                    reweighed: false,
                    refused: false,
                    not_in_room: false,
                    daily_wts: false,
                    show_alert: true,
                    scale_type: "",
                }
            })
            //Adding the previous weights
            for (let entry of weighed) {
                const previousWeights_entry = previousWeights.find(
                    (el) => el.resident_id === entry.resident_id
                )
                entry.prev_wt = previousWeights_entry.weight
            }
            for (let entry of unweighedAddedFields) {
                const previousWeights_entry = previousWeights.find(
                    (el) => el.resident_id === entry.resident_id
                )
                entry.prev_wt = previousWeights_entry.weight
            }

            //Make a list of ids of residents who already have weights entered
            const weighedIds = weighed.map((el) => el.resident_id)
            //Filter out the entries that already have weights entered
            let unweighedAddedFieldsFiltered = unweighedAddedFields.filter(
                (el) => !weighedIds.includes(el.resident_id)
            )
            setPatientListWithWeights(weighed)
            setPatientListNoWeights(unweighedAddedFieldsFiltered)
        })
    }, [])

    const checkboxstyle =
        "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"

    const handleSubmit = () => {
        //prepare post requests
        const API = "http://localhost:8000"
        const promiseArray = []
        for (let el of patientListWithWeights) {
            const address = `${API}/weightsheets/${el.weight_sheet_id}`
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
            const address = `${API}/weights/${el.weight_id}`
            const requestBody = {
                resident: el.resident_id,
                date: formattedDate(new Date()),
                weight: el.weight,
            }
            promiseArray.push(
                fetchIt(address, {
                    method: "PUT",
                    body: JSON.stringify(requestBody),
                })
            )
        }
        for (let el of patientListNoWeights) {
            const address = `${API}/weightsheets`
            const requestBody = {
                date: formattedDate(new Date()),
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
                    method: "POST",
                    body: JSON.stringify(requestBody),
                })
            )
        }
        Promise.all(promiseArray).then((data) => {
            window.alert("Data saved")
            for (let datum of data) {
                console.log(datum)
            }

        })
    }

    const handleChange = (e) => {
        const [type, index, field] = e.target.id.split("--")
        const copy =
            type === "put"
                ? [...patientListWithWeights]
                : [...patientListNoWeights]
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
        type === "put"
            ? setPatientListWithWeights(copy)
            : setPatientListNoWeights(copy)
    }
    const makeTableRows = () => {
        const filledWeightRows =
            patientListWithWeights.length > 0
                ? patientListWithWeights.map((el, index) => (
                      <tr key={`table-row-${el.resident_id}`} >
                          <td className="border px-8 py-4">{el.room_num}</td>
                          <td className="border px-8 py-4">
                              {el.first_name} {el.last_name}
                          </td>
                          <td className="border px-8 py-4">
                              <input
                                  disabled={el.final}
                                  type="Number"
                                  className="w-{1/3} bg-gray-50 border border-gray-300"
                                  value={el.weight || ""}
                                  id={`put--${index}--weight`}
                                  onChange={(e) => handleChange(e)}
                              />
                          </td>
                          <td className="border px-8 py-4">{el.prev_wt}</td>
                          <td className="border px-8 py-4">
                              <input
                                  disabled={el.final}
                                  type="checkbox"
                                  className={checkboxstyle}
                                  checked={el.reweighed}
                                  value={el.reweighed}
                                  id={`put--${index}--reweighed`}
                                  onChange={(e) => handleChange(e)}
                              />
                          </td>
                          <td className="border px-8 py-4">
                              <div className="flex items-center mb-4">
                                  <input
                                      disabled={el.final}
                                      type="checkbox"
                                      className={checkboxstyle}
                                      checked={el.not_in_room}
                                      value={el.not_in_room}
                                      id={`put--${index}--not_in_room`}
                                      onChange={(e) => handleChange(e)}
                                  />
                                  <label
                                      htmlFor="default-radio-1"
                                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                      Absent
                                  </label>
                              </div>
                              <div className="flex items-center">
                                  <input
                                      disabled={el.final}
                                      type="checkbox"
                                      className={checkboxstyle}
                                      checked={el.refused}
                                      value={el.refused}
                                      id={`put--${index}--refused`}
                                      onChange={(e) => handleChange(e)}
                                  />
                                  <label
                                      htmlFor="default-radio-2"
                                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                      Refused
                                  </label>
                              </div>
                          </td>
                          <td className="border px-8 py-4">
                              <select
                                    disabled={el.final}
                                  id={`put--${index}--scale_type`}
                                  className="flex bg-gray-50 border border-separate border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                  className={checkboxstyle}
                                  checked={el.daily_wts}
                                  value={el.daily_wts}
                                  id={`put--${index}--daily_wts`}
                                  onChange={(e) => handleChange(e)}
                              />
                          </td>
                      </tr>
                  ))
                : []
        const unfilledWeightRows =
            patientListNoWeights.length > 0
                ? patientListNoWeights.map((el, index) => (
                      <tr key={`table-row-${el.resident_id}`}>
                          <td className="border px-8 py-4">{el.room_num}</td>
                          <td className="border px-8 py-4">
                              {el.first_name} {el.last_name}
                          </td>
                          <td className="border px-8 py-4">
                              <input
                                disabled={el.final}
                                  type="Number"
                                  className="w-{1/3} bg-gray-50 border border-gray-300"
                                  value={el.weight || ""}
                                  id={`post--${index}--weight`}
                                  onChange={(e) => handleChange(e)}
                              />
                          </td>
                          <td className="border px-8 py-4">{el.prev_wt}</td>
                          <td className="border px-8 py-4">
                              <input
                                disabled={el.final}
                                  type="checkbox"
                                  className={checkboxstyle}
                                  checked={el.reweighed}
                                  value={el.reweighed}
                                  id={`post--${index}--reweighed`}
                                  onChange={(e) => handleChange(e)}
                              />
                          </td>
                          <td className="border px-8 py-4">
                              <div className="flex items-center mb-4">
                                  <input
                                    disabled={el.final}
                                      type="checkbox"
                                      className={checkboxstyle}
                                      checked={el.not_in_room}
                                      value={el.not_in_room}
                                      id={`post--${index}--not_in_room`}
                                      onChange={(e) => handleChange(e)}
                                  />
                                  <label
                                      htmlFor="default-radio-1"
                                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                      Absent
                                  </label>
                              </div>
                              <div className="flex items-center">
                                  <input
                                    disabled={el.final}
                                      type="checkbox"
                                      className={checkboxstyle}
                                      checked={el.refused}
                                      value={el.refused}
                                      id={`post--${index}--refused`}
                                      onChange={(e) => handleChange(e)}
                                  />
                                  <label
                                      htmlFor="default-radio-2"
                                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                      Refused
                                  </label>
                              </div>
                          </td>
                          <td className="border px-8 py-4">
                              <select
                                  id={`post--${index}--scale_type`}
                                  className="flex bg-gray-50 border border-separate border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                  className={checkboxstyle}
                                  checked={el.daily_wts}
                                  value={el.daily_wts}
                                  id={`post--${index}--daily_wts`}
                                  onChange={(e) => handleChange(e)}
                              />
                          </td>
                      </tr>
                  ))
                : []

                const allRows = [...filledWeightRows, ...unfilledWeightRows]

        return (
            <tbody>
                {allRows}
            </tbody>
        )
    }

    return (
        <div>
            <NavBar />

            <div className="container mx-auto flex flex-col">
                <div className="flex md:justify-around justify-between mx-10 content-center ">
                    <span>{employee.name}</span>
                    <span>{formattedDate(new Date())}</span>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
                <table className="shadow-lg bg-white border-separate overflow-scroll">
                    <thead>
                        <tr>
                            <th className="bg-blue-100 border text-left px-8 py-4">
                                Room
                            </th>
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
    )
}

export default WeeklySheet
