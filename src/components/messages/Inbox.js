import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fetchIt } from "../auth/fetchIt";
import NavBar from "../nav/NavBar";
import { discard, compose, read, unread } from "../../assets";
import MessageDetailModal from "./MessageDetailModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const formattedDate = (date) => {
  const myDate = date;

  let year = myDate.toLocaleString("default", { year: "numeric" });
  let month = myDate.toLocaleString("default", { month: "2-digit" });
  let day = myDate.toLocaleString("default", { day: "2-digit" });
  const formattedDate = month + "-" + day + "-" + year;
  return formattedDate;
};

const Inbox = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [msgClicked, setMsgClicked] = useState(false);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const user = localStorage.getItem("wt_token");
    if (user) {
      const parsedUser = JSON.parse(user);
      setName(parsedUser.name);
      setUser(parsedUser);
      fetchIt(
        `http://localhost:8000/employeemessages?recipient=${parsedUser.id}`
      ).then((data) => {
        data.sort(
          (a, b) =>
            new Date(b.message.date_created) - new Date(a.message.date_created)
        );
        setEmails(data);
      });
    }
  }, [msgClicked]);

  useEffect(() => {
    if (selectedMessage.id && !selectedMessage.message.read) {
      fetchIt(
        `http://localhost:8000/messages/${selectedMessage.message.id}/changeunreadtoread`,
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
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
            fetchIt(`http://localhost:8000/employeemessages/${id}`, {
              method: "DELETE",
            }).then(() => {
               setMsgClicked((x) => !x); //sends signal to refresh the inbox
            });
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
              <td
                scope="row"
                className="pl-6 py-4
             "
              >
                {el.message.read ? (
                  <img src={read} alt="read" className="block w-10 sm:w-8" />
                ) : (
                  <img
                    src={unread}
                    alt="unread"
                    className="block w-10 sm:w-8"
                  />
                )}
              </td>
              <td
                scope="row"
                className="pl-6 py-4 font-sm sm:font-medium text-stone-900 whitespace-nowrap"
              >
                {`${el.sender.user.first_name.slice(0, 1)}. ${
                  el.sender.user.last_name
                }`}
              </td>
              <td className="pl-6 py-4">
                <Link
                  to=""
                  className={
                    el.message.read
                      ? "font-sm sm:font-medium text-stone-600 hover:underline"
                      : "font-sm sm:font-medium text-sky-800 hover:underline"
                  }
                  onClick={() => {
                    setShowModal(true);
                    setSelectedMessage(el);
                    setMsgClicked((x) => !x);
                  }}
                >
                  {el.message.subject}
                </Link>{" "}
              </td>
              <td className="pl-6 py-4 text-stone-900 font-sm sm:font-medium">
                {formattedDate(new Date(el.message.date_created))}
              </td>
              <td className="pl-6 py-4">
                {
                  <img
                    src={discard}
                    alt="logo"
                    id={`delete--${el.id}`}
                    className="block w-5 md:w-6 cursor-pointer opacity-90"
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
      <div className=" flex-col justify-center ml-auto mr-auto mb-[310px] sm:w-2/3">
        <header className="flex justify-center">
          <h1 className="font-semibold text-stone-700 text-3xl my-8"> Inbox</h1>
        </header>
        <div className="text-center md:mt-5 mb-10">
          <h1 className="text-2xl text-stone-600">
            {name ? `Welcome ${name}` : ""}
          </h1>
        </div>
        <div className="flex items-center justify-center md:justify-start md:ml-40 mt-5 mb-5">
          <img src={compose} alt="compose" className="block w-20 md:w-[75px]" />
          <h3>
            {" "}
            <Link to="/compose">
              <span className="text-sky-800 underline -ml-3">
                Compose New Message
              </span>
            </Link>
          </h3>
        </div>
        <div className=" container flex flex-col md:m-auto before:relative overflow-auto shadow-md shadow-sky-800/40 sm:rounded-lg md:w-2/3 font-body border-solid  border-2 border-sky-600/20 py-6 px-6 sm:px-8">
          <table className="text-md text-left text-stone-700 dark:text-stone-500">
            <thead className="text-sm text-sky-900 uppercase font-semibold bg-stone-100 dark:bg-stone-700 dark:text-stone-400">
              <tr>
                <th scope="col" className=""></th>
                <th scope="col" className="px-6 py-3">
                  Sender
                </th>
                <th scope="col" className="px-6 py-3">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3"></th>
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
