import { useState, useEffect } from "react"
import { Login } from "../auth/Login"
import './Home.css'

export const Home = () => {


    return (
      <>
        <div className="font-body text-gray-700 text-xl flex justify-start ml-10">
          <p>logo here</p>
          <h1 className="text-xl text-gray-700 font-body ml-10">
            Gaffney Scranton Rehabilitation and Healing
          </h1>
        </div>
        <Login />
      </>
    );
}

