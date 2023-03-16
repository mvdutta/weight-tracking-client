import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {close, menu} from '../../assets'


const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "features",
    title: "Features",
  },
  {
    id: "product",
    title: "Product",
  },
  {
    id: "clients",
    title: "Clients",
  },
];



const NavBar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className="w-full flex py-6 justify-between items-center navbar bg-orange-100">
      <img src="/nav-logo.svg" alt="hoo BANK" className="w-[124px] h-[32px] ml-10" />
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((el, index) => (
          <li
            key={el.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] text-orange-700 ${
              index === navLinks.length - 1 ? "mr-12" : "mr-10"
            }`}
          >
            {" "}
            <Link to="/home">{el.title}</Link>
          </li>
        ))}
      </ul>
      <div className="sm:hidden flex flex-1 justify-end items-center ">
        <img
          src={
            toggle ? close : menu
          }
          alt="menu"
          className="w-[28px] h-[28px] object-contain cursor-pointer"
          onClick={() => setToggle((x) => !x)}
        />
        <div
          className={`${
            toggle ? "flex" : "hidden"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 min-w-[140px] rounded-xl sidebar bg-orange-100`}
        >
          <ul className="list-none flex flex-col">
            {navLinks.map((el, index) => (
              <li
                key={el.id}
                className={`font-poppins font-normal cursor-pointer text-[16px] text-orange-700 ${
                  index === navLinks.length - 1 ? "mr-0" : "mb-4"
                }`}
              >
                {" "}
                <a href={`#${el.id}`}>{el.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar
