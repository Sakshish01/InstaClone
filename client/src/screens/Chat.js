// import React from 'react';
import "../App.css";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import httpAPICall from "../Services";
import { useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";

const socket = io("http://192.168.0.33:8000"); // Replace the URL with your Socket.IO server URL

const Chat = () => {
  const BaseUrl = process.env.REACT_APP_BASE_URL
  const { userId } = useParams();
  // console.log('Userid params: ', userId)
  const loggedInUser = localStorage.getItem("currentUserId");
  // console.log('USERRR: ', loggedInUser)
  const currentUserId = loggedInUser;
  const [messagesList, setMessagesList] = useState([]);
  const [apidata, setApiData] = useState([]);

  const [currentmessage, setCurrentMessage] = useState("");

  // useEffect(() => {
  //   // Set user ID on server connection
  //   console.log('userId: ', userId);

  //   // Listen for receive-message event

  // }, [userId]);
  
  
  useEffect(() => {
    
    httpAPICall({
      method: "get",
      url:`${BaseUrl}messages/${userId}`,
    })
    .then((res) => {
      console.log('response', res.data);
      if (res.status === false) {
        toast.error(res.message);
      } else {
        setApiData(res.data);
        setMessagesList(res.data.messages);
        // toast.success(data.message);
      }
      })
      .catch((error) => {
        console.log(":2222222-------->>>>", error);
      });
  }, [userId]);

  useEffect(() => {

  socket.emit("set-user-id", userId);

  }, [socket]);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessagesList((list) => [...list, data]);
      console.log("MESSAGE     : ", data)
    });
  }, [socket]);


  const handleButton = async () => {
    if (currentmessage !== "") {
      const messageData = {
        message: currentmessage,
        recipient: userId,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

     socket.emit("send-message", messageData);

     setMessagesList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
    console.log('existing......', messagesList)
    // setcurrentmessage(currentmessage)

    let data = {
      conversationId: apidata.messages?.[0]?.conversationId,
      message: currentmessage,
      receiverId: userId,
    };
    httpAPICall({
      method: "post",
      url: `${BaseUrl}add-message`,
      payload: data,
    })
      .then((res) => {
        if (res.status === false) {
          toast.error(res.message);
        } else {
          // console.log("Sent message", res.data.text)
          // toast.success(data.message);
        }
      })
      .catch((error) => {
        console.log(":2222222-------->>>>", error);
      });
  };


  return (
    <div className="chat">
      {/* Chat header */}
      <div className="chat-header">
        {/* Display profile picture of the other user */}
        {apidata && (
          <div className="user-profile">
            <img src={apidata?.otherUser?.profileImage} alt={apidata?.otherUser?.name} />
            <div>
              <h3>{apidata?.otherUser?.name}</h3>
              {/* <p className={otherUser.online ? "online" }> */}
              <p>{"Online"}</p>
            </div>
          </div>
        )}
      </div>
      {/* Chat body */}
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messagesList && messagesList.map((messageContent) => {
            return (
              <div
              key={messageContent._id}
              className={
                messageContent.receiverId === currentUserId ? "received" : "sent"
              } // Apply different style based on senderId
            >
              <p>{messageContent?.text || messageContent?.message}</p>
              <span>{messageContent.time}</span>
            </div>
            );
})}
        </ScrollToBottom>
      </div>

      {/* Chat footer */}
      <div className="chat-footer">
        <input
          type="text"
          value={currentmessage}
          placeholder="Type a message..."
          
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(event) => {
            event.key === "Enter" && handleButton();
          }} // Assuming you're using state to capture the message input
        />
        <button onClick={() => handleButton()}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
