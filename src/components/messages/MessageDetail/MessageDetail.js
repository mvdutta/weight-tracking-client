import React from 'react'
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchIt } from "../../auth/fetchIt";
import NavBar from '../../nav/NavBar';

const MessageDetail = () => {

 let { id } = useParams();
 const [email, setEmail] = useState({})
const navigate = useNavigate();



	const goBack = () => {
    console.log("clicked")
    navigate('/inbox');
  };

   useEffect(() => {

        fetchIt(
            `http://localhost:8000/messages/${id}`
        ).then((data) => {
            setEmail(data);
        });
   }, []);

  return (
    <>
      <NavBar />
      <div className="container">
        <div>Subject: {email.subject}</div>
        <div>{email.message_body}</div>
        <Link to="/inbox">
          <button className="bg-blue-500">Back</button>
        </Link>
      </div>
    </>
  );
}

export default MessageDetail