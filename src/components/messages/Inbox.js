import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fetchIt } from "../auth/fetchIt";
import NavBar from "../nav/NavBar";
import { discard, compose, read, unread } from "../../assets";
import MessageDetailModal from "./MessageDetailModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../weightSheets/WeightSheets.css";
import { getAPIroot } from "../utilities/getAPIroot";

const formattedDate = (date) => {
  const myDate = date;

  let year = myDate.toLocaleString("default", { year: "numeric" });
  let month = myDate.toLocaleString("default", { month: "2-digit" });
  let day = myDate.toLocaleString("default", { day: "2-digit" });
  const formattedDate = month + "-" + day + "-" + year;
  return formattedDate;
};

const APIROOT = getAPIroot();

const Inbox = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState("");
  const MySwal = withReactContent(Swal);



  useEffect(() => {
    const user = localStorage.getItem("wt_token");
    if (user) {
      const parsedUser = JSON.parse(user);
      setName(parsedUser.name);
      setUser(parsedUser);
      fetchIt(
        `${APIROOT}employeemessages?recipient=${parsedUser.id}`
      ).then((data) => {
        data.sort(
          (a, b) =>
            new Date(b.message.date_created) - new Date(a.message.date_created)
        );
        setEmails(data);
      });
    }
  }, [emails]);

  useEffect(() => {
    if (selectedMessage.id && !selectedMessage.message.read) {
      fetchIt(
        `${APIROOT}messages/${selectedMessage.message.id}/changeunreadtoread`,
        {
          method: "PUT",
        }
      ).then((data) => {});
    }
  }, [selectedMessage]);

  const deleteEmail = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "This email will be permanently deleted!",
      icon: "warning",
      iconColor: "#925631",
      showCancelButton: true,
      confirmButtonColor: "#DAA520",
      cancelButtonColor: "#0284c7",
      confirmButtonText: "Yes, delete it!",
      customClass: "final-warning",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetchIt(`${APIROOT}employeemessages/${id}`, {
          method: "DELETE",
        })
      }
    });
  };

  const makeTableRows = () => (
    <>
      <tbody>
        {emails.map((el) => (
          <>
            <tr
              key={`table-row-${el.id}`}
              className="bg-white border-b dark:bg-stone-800 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-600"
            >
              <td scope="row" className="">
                {el.message.read ? (
                  <img src={read} alt="read" className="w-7 sm:w-8" />
                ) : (
                  <img src={unread} alt="unread" className="w-7" />
                )}
              </td>
              <td scope="row" className=" text-stone-900">
                {`${el.sender.user.first_name.slice(0, 1)}. ${
                  el.sender.user.last_name
                }`}
              </td>
              <td className="">
                <Link
                  to=""
                  className={
                    el.message.read
                      ? "text-stone-900 hover:underline"
                      : "text-sky-800 hover:underline"
                  }
                  onClick={() => {
                    setShowModal(true);
                    setSelectedMessage(el);
                  }}
                >
                  {el.message.subject}
                </Link>{" "}
              </td>
              <td className="text-stone-900">
                {formattedDate(new Date(el.message.date_created))}
              </td>
              <td className="py-4">
                {
                  <img
                    src={discard}
                    alt="delete"
                    id={`delete--${el.id}`}
                    className="w-6 md:w-6 cursor-pointer opacity-90"
                    onClick={(evt) => {
                      const [_, id] = evt.target.id.split("--");
                      deleteEmail(id);
                    }}
                  />
                }
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </>
  );

  return (
    <>
      <NavBar />
      <div className=" flex-col justify-center ml-auto mr-auto mb-[275px] lg:w-2/3">
        <header className="flex justify-center">
          <h1 className="font-semibold text-stone-700 text-3xl my-8"> Inbox</h1>
        </header>
        <div className="text-center md:mt-5 mb-10">
          <h1 className="text-2xl text-stone-600">
            {name ? `Welcome ${name}` : ""}
          </h1>
        </div>
        <div className="flex items-center md:justify-start md:ml-20 lg:ml-40 mt-5 mb-5">
          <img
            src={compose}
            alt="compose"
            className="block w-20 sm:w-[100px] lg:w-[75px]"
          />
          <h3>
            {" "}
            <Link to="/compose">
              <span className="text-sky-800 underline -ml-3 text-lg">
                Compose New Message
              </span>
            </Link>
          </h3>
        </div>
        <div className=" flex flex-col m-auto overflow-auto sm:shadow-md border-2 shadow-stone-400 sm:rounded-lg w-full sm:w-5/6 lg:w-2/3 font-body py-6 sm:px-12">
          <table className="table-auto text-sm sm:text-md text-left text-stone-700 dark:text-stone-500">
            <thead className="text-sm text-sky-900 uppercase font-semibold bg-stone-100 dark:bg-stone-700 dark:text-stone-400">
              <tr>
                <th scope="col" className="py-4"></th>
                <th scope="col" className="px-2 py-4">
                  Sender
                </th>
                <th scope="col" className="px-2 py-4">
                  Subject
                </th>
                <th scope="col" className="px-2 py-4">
                  Date
                </th>
                <th scope="col" className="px-2 py-4"></th>
              </tr>
            </thead>
            {makeTableRows()}
          </table>
        </div>
      </div>
      <MessageDetailModal
        showModal={showModal}
        setShowModal={setShowModal}
        email={selectedMessage}
      />
    </>
  );
};

export default Inbox;
