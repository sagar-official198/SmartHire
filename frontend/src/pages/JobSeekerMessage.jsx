import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "../component/Navbar";

function JobSeekerMessage() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const { getToken } = useAuth();

  const [chatUsers, setChatUsers] =
    useState([]);
  const [selectedUser, setSelectedUser] =
    useState(null);
  const [messages, setMessages] =
    useState([]);
  const [messageText, setMessageText] =
    useState("");

  const handleCloseChat = () => {
    setSelectedUser(null);
    setMessages([]);
    setMessageText("");
    navigate("/dashboard");
  };

  const fetchChatHistory = async () => {
    try {
      const token = await getToken();

      const res = await axios.get(
        "http://localhost:5000/api/messages/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChatUsers(
        res.data.data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (
    userId
  ) => {
    try {
      const token = await getToken();

      const res = await axios.get(
        `http://localhost:5000/api/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(
        res.data.data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    try {
      if (!selectedUser) {
        alert(
          "Select chat first"
        );
        return;
      }

      if (
        !messageText.trim()
      )
        return;

      const token = await getToken();

      await axios.post(
        "http://localhost:5000/api/messages/send",
        {
          receiverId:
            selectedUser._id,
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

      await Promise.all([
        fetchMessages(
          selectedUser._id
        ),
        fetchChatHistory(),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChatHistory();

      if (selectedUser) {
        fetchMessages(
          selectedUser._id
        );
      }
    }, 2000);

    return () =>
      clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#efeae2]">
      <Navbar />

      {/* IMPORTANT FIX */}
      <div className="pt-20 flex h-[calc(100vh-80px)]">
        
        {/* LEFT SIDE */}
        <div className="w-[320px] bg-white border-r flex flex-col">
          
          {/* HEADER */}
          <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="text-xl font-bold">
              Messages
            </h2>

            <button
              onClick={
                handleCloseChat
              }
              className="bg-red-500 text-white px-4 py-2 rounded-xl"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatUsers.length >
            0 ? (
              chatUsers.map(
                (user) => (
                  <div
                    key={
                      user._id
                    }
                    onClick={() => {
                      setSelectedUser(
                        user
                      );
                      fetchMessages(
                        user._id
                      );
                    }}
                    className="p-4 border-b cursor-pointer hover:bg-gray-100"
                  >
                    <h3 className="font-semibold">
                      {
                        user.fullName
                      }
                    </h3>

                    <p className="text-sm text-gray-500 truncate">
                      {
                        user.lastMessage
                      }
                    </p>
                  </div>
                )
              )
            ) : (
              <div className="p-4 text-gray-500">
                No chats yet
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="bg-white p-4 border-b font-semibold text-lg">
                {
                  selectedUser.fullName
                }
              </div>

              <div className="flex-1 p-6 overflow-y-auto bg-[#efeae2]">
                {messages.length >
                0 ? (
                  messages.map(
                    (
                      msg
                    ) => (
                      <div
                        key={
                          msg._id
                        }
                        className={`mb-3 flex ${
                          msg.senderType ===
                          "jobseeker"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl shadow ${
                            msg.senderType ===
                            "jobseeker"
                              ? "bg-green-200"
                              : "bg-white"
                          }`}
                        >
                          {
                            msg.message
                          }
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center text-gray-500">
                    No messages yet
                  </div>
                )}

                <div
                  ref={
                    chatEndRef
                  }
                ></div>
              </div>

              <div className="p-4 bg-white border-t flex gap-3">
                <input
                  value={
                    messageText
                  }
                  onChange={(
                    e
                  ) =>
                    setMessageText(
                      e.target
                        .value
                    )
                  }
                  className="flex-1 border rounded-full px-4 py-3"
                  placeholder="Type reply"
                />

                <button
                  onClick={
                    sendMessage
                  }
                  className="bg-green-500 text-white px-6 rounded-full"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobSeekerMessage;