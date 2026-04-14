import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import axios from "axios";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import RecruiterNavbar from "../component/Rnavbar";

function RecruiterMessage() {
  const navigate = useNavigate();
  const location = useLocation();
  const chatEndRef = useRef(null);

  const token =
    localStorage.getItem("recruiterToken");

  const receiverData = location.state || {
    receiverId: localStorage.getItem(
      "chatReceiverId"
    ),
    receiverName: localStorage.getItem(
      "chatReceiverName"
    ),
  };

  const {
    receiverId,
    receiverName,
  } = receiverData;

  const [messages, setMessages] =
    useState([]);
  const [messageText, setMessageText] =
    useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(res.data.data || []);
    } catch (error) {
      console.error(
        "Fetch error:",
        error.response?.data || error
      );
    }
  };

  const sendMessage = async () => {
    try {
      if (!messageText.trim()) {
        alert("Enter message");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/messages/send",
        {
          receiverId,
          message:
            messageText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessageText("");
      fetchMessages();
    } catch (error) {
      console.error(
        "Send error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Send failed"
      );
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [receiverId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#efeae2]">
      <RecruiterNavbar />

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-[320px] bg-white border-r">
          <div className="p-4 border-b flex justify-between">
            <h2 className="text-xl font-bold">
              Messaging
            </h2>

            <button
              onClick={() =>
                navigate(
                  "/recruiter-dashboard"
                )
              }
              className="bg-red-500 text-white px-4 py-2 rounded-xl"
            >
              Close
            </button>
          </div>

          <div className="p-4">
            <h3 className="font-semibold">
              {receiverName}
            </h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white p-4 border-b font-semibold text-lg">
            {receiverName}
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-3 flex ${
                  msg.senderType ===
                  "recruiter"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow ${
                    msg.senderType ===
                    "recruiter"
                      ? "bg-green-200"
                      : "bg-white"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}

            <div ref={chatEndRef}></div>
          </div>

          <div className="p-4 bg-white border-t flex gap-3">
            <input
              value={messageText}
              onChange={(e) =>
                setMessageText(
                  e.target.value
                )
              }
              className="flex-1 border rounded-full px-4 py-3"
              placeholder="Type message"
            />

            <button
              onClick={sendMessage}
              className="bg-green-500 text-white px-6 rounded-full"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterMessage;