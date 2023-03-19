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
    const formattedDate = month + "-" + day + "-" + year
    return formattedDate
}

const WeeklySheet = () => {
    const [patientList, setPatientList] = useState([])
    const [filledWeightsheets, setFilledWeightsheets] = useState([])
    const [filledWeights, setFilledWeights] = useState([])
    const [employee, setEmployee] = useState({})
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
        const API = "http://localhost:8000/residents"
        fetchIt(API).then((data) => {
            setPatientList(data)
        })
    }, [])

    useEffect(() => {
        const todaysDate = formattedDate(new Date())
        const API1 = `http://localhost:8000/weightsheets?date=${todaysDate}`
        const API2 = `http://localhost:8000/weights?date=${todaysDate}`
        fetchIt(API1).then((data) => {
            console.log(data)
            setFilledWeightsheets(data)
        })
        fetchIt(API2).then((data) => {
          console.log(data)
          setFilledWeights(data)
      })
      if (filledWeightsheets.length!==filledWeights.length){
        throw new Error("The number of filled weights does not match the number of filled weightsheets")
      }
    }, [])

    const checkboxstyle =
        "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"

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
                        <input type="checkbox" className={checkboxstyle} />
                    </td>
                    <td className="border px-8 py-4">
                        <div className="flex items-center mb-4">
                            <input
                                checked={false}
                                id="default-radio-1"
                                type="radio"
                                value=""
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                                id="default-radio-2"
                                type="radio"
                                value=""
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                        <input type="checkbox" className={checkboxstyle} />
                    </td>
                </tr>
            ))}
        </tbody>
    )

    return (
        <div>
            <NavBar />

            <div className="container mx-auto flex flex-col">
                <div className="flex md:justify-around justify-between mx-10">
                    <p>{employee.name}</p>
                    <p>{formattedDate(new Date())}</p>
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
