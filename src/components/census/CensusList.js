import React from 'react'
import NavBar from '../nav/NavBar'
import './Censuslist.css'

export const CensusList = () => {
  
  return (
    <>
      <NavBar />
      <header className="flex justify-center">
        <h1 className="font-semibold text-stone-700 text-3xl mt-10 mb-44">
          {" "}
          Current Census List
        </h1>
      </header>

      <div className=" container flex flex-col m-auto before:relative overflow-x-auto shadow-md sm:rounded-lg w-2/3 font-body border-solid border-2 border-sky-600/20">
        <table className="text-md text-center text-stone-700 dark:text-stone-500">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800 text-center">
            Gaffney Scranton Rehabilitation & Healing
            <p className="mt-1 text-md font-normal text-stone-600 dark:text-stone-400">
              Resident Census List
            </p>
            <p className="mt-1 text-sm font-normal text-stone-600 dark:text-stone-400">
              Accessed: 02/28/2023
            </p>
            <p className="mt-1 text-sm font-normal text-stone-600 dark:text-stone-400">
              Current Residents (10)
            </p>
          </caption>
          <thead className="text-sm text-stone-700 uppercase font-semibold bg-stone-100 dark:bg-stone-700 dark:text-stone-400">
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
          <tbody>
            <tr className="bg-white border-b dark:bg-stone-800 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-600">
              <td
                scope="row"
                className="px-6 py-4 font-medium text-stone-900 whitespace-nowrap dark:text-white"
              >
                100
              </td>
              <td className="px-6 py-4">Scott, Michael</td>
              <td className="px-6 py-4">06/20/2022</td>
            </tr>
            <tr className="bg-white border-b dark:bg-stone-800 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-600">
              <td
                scope="row"
                className="px-6 py-4 font-medium text-stone-900 whitespace-nowrap dark:text-white"
              >
                101
              </td>
              <td className="px-6 py-4">Schrute, Dwight</td>
              <td className="px-6 py-4">06/29/2018</td>
            </tr>
            <tr className="bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-600">
              <td
                scope="row"
                className="px-6 py-4 font-medium text-stone-900 whitespace-nowrap dark:text-white"
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

