import { useState } from "react"
import { createRenderer } from "react-dom/test-utils";
import { useNavigate } from "react-router-dom"
import { fetchIt } from "./fetchIt";
import { close } from "../../assets";

const ROLES = ["NP", "RD", "MD", "RN", "LPN", "CNA"]; 

const RegisterModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    role: "",
  });
  let navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault()
    //If no email has been provided give them a default email address
    return fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((createdUser) => {
        if (createdUser.hasOwnProperty("id")) {
          localStorage.setItem(
            "wt_token",
            JSON.stringify({
              id: createdUser.id,
              name: createdUser.first_name,
              token: createdUser.token,
              role: createdUser.role,
            })
          );
          navigate("/");
          window.location.reload(false);
        }
      });
  };

   const updateUser = (evt) => {
     const copy = { ...user };
     copy[evt.target.id] = evt.target.value;
     setUser(copy);
   };

  return (
    <>
      <button
        className="text-dark opacity-90 text-decoration-line: underline text-md font-bold mt-3 mb-3"
        type="button"
        onClick={() => setShowModal(true)}
      >
        New User Registration
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-800/40">
            <div className="relative w-full my-6 mx-auto max-w-[400px]">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold text-burnt font-body">
                    Registration Form
                  </h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span>
                      <img className="w-8" src={close} alt="close-icon" />
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto font-body">
                  <form
                    className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full"
                    onSubmit={handleRegister}
                  >
                    <label className="block text-dark text-md text-left font-bold mb-2">
                      First Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      onChange={updateUser}
                      type="text"
                      id="first_name"
                      required
                      autoFocus
                    />
                    <label className="block text-dark text-md text-left font-bold my-2">
                      Last Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      onChange={updateUser}
                      type="text"
                      id="last_name"
                      required
                    />
                    <label className="block text-dark text-md text-left font-bold my-2">
                      Your GSRH username
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      onChange={updateUser}
                      type="text"
                      id="username"
                      required
                    />
                    <label className="block text-dark text-md text-left font-bold my-2">
                      Password
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      onChange={updateUser}
                      type="password"
                      id="password"
                      required
                    />
                    <label className="block text-dark text-md text-left font-bold my-2">
                      Role
                    </label>
                    <select
                      className="shadow appearance-none border text-dark rounded w-full py-2 px-1"
                      id="role"
                      onChange={updateUser}
                    >
                      <option key="selectrole" value="">
                        Select your role
                      </option>
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-burnt background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 font-body"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="text-white bg-sky-600  hover:bg-sky-400 font-bold text-xs px-4 uppercase py-2 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 font-body"
                    type="submit"
                    onClick={(e) => {
                      handleRegister(e);
                      setShowModal(false);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default RegisterModal;