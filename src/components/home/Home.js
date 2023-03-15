import { useState, useEffect } from "react"
import { Login } from "../auth/Login"
import './Home.css'

export const Home = () => {


    return (
      <>
        <div className="font-body text-gray-700 text-xl flex justify-evenly">
          <h1 className="text-6xl text-gray-700 font-body">Hello</h1>
          <p>Enter weights here</p>
        </div>
        <div className="flex items-end justify-center">
          <div className="bg-red-500 h-4 w-6"></div>
          <div className="bg-blue-500 h-8 w-6"></div>
          <div className="bg-green-500 h-12 w-6"></div>
          <div className="bg-purple-500 h-16 w-6"></div>
        </div>
        <Login />
      </>
    );
}

