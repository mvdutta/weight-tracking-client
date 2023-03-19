import { useState, useEffect } from "react"
import { Login } from "../auth/Login"
import HomeNav from "../nav/HomeNav";
import './Home.css'

export const Home = () => {


    return (
      <>
        <HomeNav />
        <Login />
      </>
    );
}

