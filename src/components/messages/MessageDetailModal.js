import React from "react";
import { close } from "../../assets";

const MessageDetailModal = ({ showModal, setShowModal, email }) => {
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-scroll fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative  w-2/3 md:w-1/3 my-6 mx-auto">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-stone-200 rounded-t">
                  <h3 className="text-xl font-body text-stone-700 font-semibold">
                    {email.message.subject}
                  </h3>
                  <button
                    className="p-1 ml-auto float-right leading-none outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="">
                      <img className="w-7" src={close} alt="close-icon" />
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-stone-600 text-lg leading-relaxed">
                    {email.message.message_body}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-stone-200 rounded-b">
                  <button
                    className="bg-amber-500/90 hover:bg-amber-400 py-2 px-3 md:py-3 md:px-4 text-sm md:text-md text-white rounded-full font-bold border focus:outline-none focus:border-amber-600"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default MessageDetailModal;
