import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiSearch, FiSend } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";

const ChatHistory = ({
  selectedChat,
  messages,
  message,
  setMessage,
  handleSendMessage,
  userId,
  loadingMessages,
  noHistory,
  chatBlocked,
  onlineStatus,
  fetchOlderMessages,
  hasMore,
  onSocketMessage,
}) => {
  const navigate = useNavigate();
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUsername = loggedInUser?.username;
  const [isOnline, setIsOnline] = useState(selectedChat?.online || false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const chatAreaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const typingTimeout = useRef(null);
  const socketRef = useRef(null);
  const previousScrollHeight = useRef(0);

  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", { loggedInUsername, userId });

    const handleNewMessage = ({ newMessage }) => {
      if (onSocketMessage) onSocketMessage(newMessage);
    };
    const handleOnlineStatus = ({ username, online }) => {
      if (username === userId) setIsOnline(online);
    };
    const handleTyping = ({ username }) => {
      if (username === userId) setShowTyping(true);
    };
    const handleStopTyping = ({ username }) => {
      if (username === userId) setShowTyping(false);
    };
    socket.on("messageReceived", handleNewMessage);
    socket.on("userOnlineStatus", handleOnlineStatus);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    return () => {
      socket.off("messageReceived", handleNewMessage);
      socket.off("userOnlineStatus", handleOnlineStatus);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.disconnect();
    };
  }, [loggedInUsername, userId, onSocketMessage]);

  useEffect(() => {
    if (chatAreaRef.current && !isFetchingMore) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isFetchingMore]);

  useEffect(() => {
    if (isFetchingMore && chatAreaRef.current) {
      const currentScrollHeight = chatAreaRef.current.scrollHeight;
      const scrollDifference =
        currentScrollHeight - previousScrollHeight.current;
      chatAreaRef.current.scrollTop = scrollDifference;
    }
  }, [messages, isFetchingMore]);

  const handleScroll = async () => {
    if (!hasMore || isFetchingMore || !chatAreaRef.current) return;
    const { scrollTop, scrollHeight } = chatAreaRef.current;
    if (scrollTop <= 100) {
      setIsFetchingMore(true);
      previousScrollHeight.current = scrollHeight;
      await fetchOlderMessages();
      setIsFetchingMore(false);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("typing", { loggedInUsername, userId });
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current.emit("stopTyping", { loggedInUsername, userId });
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Chat header */}
      <div className="flex flex-shrink-0 items-center border-b border-slate-100 bg-white p-5 lg:rounded-tr-[2.5rem]">
        <button
          className="mr-4 text-slate-400 hover:text-slate-600 md:hidden"
          onClick={() => navigate("/chat")}
        >
          <IoMdClose size={24} />
        </button>
        {(selectedChat || onlineStatus) && (
          <Link to={"/profile/" + userId} className="flex items-center group">
            <div className="relative">
              <img
                src={(selectedChat || onlineStatus)?.avatar}
                alt={(selectedChat || onlineStatus)?.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm transition-transform group-hover:scale-105"
              />
              {isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>}
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-slate-800 tracking-tight">
                {(selectedChat || onlineStatus)?.name}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isOnline ? <span className="text-green-500">Active Now</span> : "Offline"}
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Chat messages area */}
      <div
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto bg-white p-6 space-y-4"
        onScroll={handleScroll}
        style={{ maxHeight: "calc(100vh - 220px)" }}
      >
        {isFetchingMore && (
          <div className="flex items-center justify-center py-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            Syncing History...
          </div>
        )}
        {chatBlocked ? (
          <div className="flex h-full flex-col items-center justify-center px-10 text-center">
            <div className="mb-4 rounded-full bg-red-50 p-4 text-red-500">
                <IoMdClose size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Connection Required</p>
            <p className="mt-2 text-slate-500">You must be connected to message this developer.</p>
          </div>
        ) : loadingMessages ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : noHistory ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
             <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-600">
                <FiMessageSquare size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No conversation yet</p>
            <p className="mt-1 text-slate-500">Say hello to start building together!</p>
          </div>
        ) : (
          <>
            {messages?.map((msg, idx) => {
              const isSender = msg.sender === loggedInUsername;
              return (
                <div
                  key={msg._id || idx}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-xs sm:max-w-md rounded-2xl px-5 py-3 text-sm font-medium shadow-sm ${
                      isSender
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <p
                      className={`mt-2 text-[10px] font-bold uppercase tracking-tighter ${isSender ? "text-blue-100/70" : "text-slate-400"}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
            {showTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-50 px-5 py-3 border border-slate-100">
                  <div className="flex space-x-1">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600"></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Message input */}
      <div className="flex-shrink-0 border-t border-slate-100 bg-white p-6 lg:rounded-br-[2.5rem]">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Write your message..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (!chatBlocked && e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={chatBlocked}
          />
          <button
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            onClick={chatBlocked ? undefined : handleSendMessage}
            disabled={chatBlocked || !message.trim()}
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

ChatHistory.propTypes = {
  selectedChat: PropTypes.object,
  messages: PropTypes.array.isRequired,
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  userId: PropTypes.string,
  loadingMessages: PropTypes.bool,
  noHistory: PropTypes.bool,
  chatBlocked: PropTypes.bool,
  onlineStatus: PropTypes.object,
  fetchOlderMessages: PropTypes.func,
  hasMore: PropTypes.bool,
  onSocketMessage: PropTypes.func,
};

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [noChats, setNoChats] = useState(false);
  const [noHistory, setNoHistory] = useState(false);
  const [chatHeader, setChatHeader] = useState(null);
  const [chatBlocked, setChatBlocked] = useState(false);
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUsername = loggedInUser?.username;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BackendURL}/chats`,
          { withCredentials: true },
        );
        if (res.data.success && res.data.chats.length > 0) {
          setChats(res.data.chats);
          setNoChats(false);
        } else {
          setChats([]);
          setNoChats(true);
        }
      } catch {
        setChats([]);
        setNoChats(true);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();

    const socket = createSocketConnection();
    const handleUnreadUpdate = () => {
      fetchChats();
    };
    socket.on("unreadUpdated", handleUnreadUpdate);
    return () => {
      socket.off("unreadUpdated", handleUnreadUpdate);
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    if (!userId) {
      setMessages([]);
      setSelectedChat(null);
      setNoHistory(false);
      setChatHeader(null);
      setChatBlocked(false);
      setHasMore(true);
      return;
    }
    setLoadingMessages(true);
    setNoHistory(false);
    setChatBlocked(false);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/chats/${userId}/messages`,
        { withCredentials: true },
      );
      if (res.data.success) {
        setMessages(res.data.messages);
        setNoHistory(res.data.messages.length === 0);
        setChatHeader(res.data.header || null);
        setHasMore(res.data.hasMore !== false);
      } else {
        setMessages([]);
        setNoHistory(true);
        setChatHeader(res.data.header || null);
        setHasMore(false);
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setChatBlocked(true);
        setMessages([]);
        setNoHistory(true);
        setChatHeader(err.response.data.header || null);
      } else if (err.response && err.response.data && err.response.data.header) {
        setMessages([]);
        setNoHistory(true);
        setChatHeader(err.response.data.header);
      } else {
        setMessages([]);
        setNoHistory(true);
        setChatHeader(null);
      }
      setHasMore(false);
    } finally {
      setLoadingMessages(false);
    }
    const chat = chats.find((c) => c.userId === userId);
    setSelectedChat(chat || null);
  };

  useEffect(() => {
    fetchMessages();
  }, [userId, chats]);

  const handleSendMessage = () => {
    if (message.trim() === "" || chatBlocked) return;

    const newMessage = {
      userId,
      sender: loggedInUsername,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const socket = createSocketConnection();
    socket.emit("sendMessage", { loggedInUsername, userId, newMessage });

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setNoHistory(false);
  };

  const fetchOlderMessages = async () => {
    if (messages.length === 0 || !hasMore) return;
    const oldest = messages[0];
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/chats/${userId}/messages?limit=20&before=${oldest.createdAt}`,
        { withCredentials: true },
      );
      if (res.data.success && res.data.messages.length > 0) {
        setMessages((prev) => [...res.data.messages, ...prev]);
        setHasMore(res.data.hasMore !== false);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSocketMessage = (newMessage) => {
    setMessages((prev) => {
      const exists = prev.some(
        (msg) =>
          msg.sender === newMessage.sender &&
          msg.text === newMessage.text &&
          msg.time === newMessage.time,
      );
      return exists ? prev : [...prev, newMessage];
    });
  };

  return (
    <div className="h-[calc(100vh-5rem)] py-8 px-4 sm:px-8 bg-white">
      <div className="flex h-full overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        {/* Sidebar */}
        <div
          className={`${userId ? "hidden md:flex" : "flex"} flex-col w-full md:w-1/3 lg:w-1/4 border-r border-slate-50`}
        >
          {/* Sidebar Header */}
          <div className="p-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Messages</h2>
            <div className="relative mt-5">
              <FiSearch className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search connections..."
                className="w-full rounded-xl bg-slate-50 py-3 pl-11 pr-4 text-xs font-bold uppercase tracking-widest text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all border border-transparent focus:border-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-3 pb-6">
            {loadingChats ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              </div>
            ) : noChats ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Your inbox is empty</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.userId}
                  onClick={() => navigate(`/chat/${chat.userId}`)}
                  className={`group relative mb-2 flex items-center gap-4 rounded-[1.5rem] p-4 cursor-pointer transition-all duration-300
                    ${userId === chat.userId ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "hover:bg-slate-50 text-slate-800"}`}
                >
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`truncate font-bold tracking-tight ${userId === chat.userId ? "text-white" : "text-slate-800"}`}>
                        {chat.name}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase ${userId === chat.userId ? "text-blue-100" : "text-slate-400"}`}>
                        {chat.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`truncate text-xs font-medium ${userId === chat.userId ? "text-blue-50" : "text-slate-500"}`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && userId !== chat.userId && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white ring-2 ring-white shadow-md">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${userId ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
          {userId ? (
            <ChatHistory
              selectedChat={selectedChat || chatHeader}
              messages={messages}
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              userId={userId}
              loadingMessages={loadingMessages}
              noHistory={noHistory}
              chatBlocked={chatBlocked}
              onlineStatus={chatHeader}
              fetchOlderMessages={fetchOlderMessages}
              hasMore={hasMore}
              onSocketMessage={handleSocketMessage}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-white">
              <div className="text-center px-6">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                    <FiMessageSquare size={40} />
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-800">Your Workspace</h3>
                <p className="mt-2 text-sm font-medium text-slate-400 max-w-xs mx-auto">
                  Select a conversation from the sidebar to coordinate with your fellow developers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;