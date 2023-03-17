import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { close, menu } from "../../assets";
import "./NavBar.css";

const sameLinks = [
  {
    id: "censuslist",
    title: "Census List",
    address: "/censuslist",
  },
  {
    id: "rd_messages",
    title: "Messages",
    address: "/inbox",
  },
];

const navLinks = {
  RD: [
    {
      id: "rd_dashboard",
      title: "RD Dashboard",
      address: "/rddashboard",
    },
  ].concat(sameLinks),

  CNA: [
    {
      id: "dashboard",
      title: "CNA Dashboard",
      address: "/cnadashboard",
    },
    {
      id: "weightsheet",
      title: "Weight Sheet",
      address: "/weeklysheet",
    },
  ].concat(sameLinks),

  RN: [
    {
      id: "dashboard",
      title: "Dashboard",
      address: "/rndashboard",
    },
    {
      id: "weightsummary",
      title: "Weight Summary",
      address: "/weightsummary",
    },
  ].concat(sameLinks),
};

const NavBar = () => {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: "", token: "", name: "", role: "" });
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const current_user = localStorage.getItem("wt_token");
    if (current_user) {
      const parsedUser = JSON.parse(current_user);
      setUser(parsedUser);
      if (parsedUser.role === "RD") {
        setLinks(navLinks.RD);
      } else if (parsedUser.role === "CNA") {
        setLinks(navLinks.CNA);
      } else {
        setLinks(navLinks.RN);
      }
    }
  }, []);
  const handleLogout = () => {
    if (window.confirm(`${user.name}, are you sure you want to log out?`)) {
      localStorage.removeItem("wt_token");
      navigate("/", { replace: true });
    }
  };
  return (
    <nav className="w-full flex py-6 justify-between items-center navbar bg-orange-200/50 ">
      <img src="/gsrh-logo3.png" alt="logo" className="logo-image" />
      <ul className="list-none lg:flex hidden justify-end items-center flex-1">
        {links.map((el) => (
          <li
            key={el.id}
            className="font-poppins font-normal cursor-pointer text-[16px] text-sky-900 mr-16"
          >
            {" "}
            <Link to={el.address}>{el.title}</Link>
          </li>
        ))}
        <li
          key={"logout1"}
          className="font-poppins font-normal cursor-pointer text-[16px] text-sky-900 mr-20"
        >
          {" "}
          <Link to="" onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
      <div className="lg:hidden flex flex-1 justify-end items-center ">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[100px] h-[30px] object-contain cursor-pointer"
          onClick={() => setToggle((x) => !x)}
        />
        <div
          className={`${
            toggle ? "flex" : "hidden"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 min-w-[140px] rounded-xl sidebar bg-orange-100`}
        >
          <ul className="list-none flex flex-col">
            {links.map((el, index) => (
              <li
                key={el.id}
                className="font-poppins font-normal cursor-pointer text-[16px] text-orange-700 mb-4"
              >
                {" "}
                <Link to={el.address}>{el.title}</Link>
              </li>
            ))}
            <li
              key={"logout2"}
              className="font-poppins font-normal cursor-pointer text-[16px] text-orange-700 mb-0"
            >
              {" "}
              <Link to="" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
