"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserX, ArrowLeft, Clock, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

import MessageInput from "../components/MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";
import { useSidebarStore } from "../store/useSidebarStore";
import { axiosInstance } from "../lib/axios";

const ChatPage = () => {
  const { id: chatUserId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const {
    messages,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useMessageStore();

  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef(null);

  const match = matches.find((m) => m?._id === chatUserId);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const diff = container.scrollHeight - container.scrollTop - container.clientHeight;
      const isAtBottom = diff < 0;
      setShowScrollButton(!isAtBottom);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (chatUserId) {
      axiosInstance.post(`/messages/mark-seen/${chatUserId}`).catch(console.error);
    }
  }, [chatUserId]);

  useEffect(() => {
    if (authUser && chatUserId) {
      getMyMatches();
      getMessages(chatUserId);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [
    getMyMatches,
    authUser,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    chatUserId,
  ]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  const handleBackClick = () => {
    navigate("/");
    setTimeout(() => {
      useSidebarStore.getState().openDrawer();
    }, 300);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? "Just now"
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoadingMyMatches) return <LoadingMessagesUI />;
  if (!match) return <MatchNotFound />;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-950/40 to-indigo-950/60 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-indigo-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Floating header */}
      <div className="sticky top-0 z-20 px-4 py-0">
        <div className="max-w-3xl mx-auto flex justify-center">
          <div className="w-full flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-t-xl shadow px-4 py-3 gap-4 relative">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleBackClick}
                className="p-1.5 hover:bg-slate-700/50 rounded-lg group transition"
              >
                <ArrowLeft size={18} className="text-slate-400 group-hover:text-white" />
              </button>
              <div className="relative">
                <img src={match.image || "/avatar.png"} alt={match.name} className="w-10 h-10 rounded-full ring-2 ring-purple-500/30 shadow" />
              </div>
            </div>
            <div className="flex flex-col items-end relative">
              <motion.button
                onClick={scrollToBottom}
                className="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-600 text-xs text-white shadow"
              >
                ↓ Scroll to Bottom
              </motion.button>
              {/* removed orange match label here */}
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={scrollToBottom}
                  className="absolute top-full mt-1 px-2 py-1 text-xs rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow"
                >
                  ↓ Scroll
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col flex-grow relative z-10 max-w-3xl mx-auto w-full overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="relative flex-1 overflow-y-auto px-4 lg:px-6 py-0 space-y-1 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent bg-slate-800/20 border-x-2 border-slate-700/40"
        >
          {messages.length === 0 ? (
            <EmptyChat match={match} />
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.sender === authUser._id;
              const showAvatar = !isOwn && (
                index === 0 || messages[index - 1]?.sender !== msg.sender
              );
              const isLastInGroup =
                index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender;
              const showTimestamp =
                isLastInGroup ||
                (index < messages.length - 1 &&
                  new Date(messages[index + 1]?.createdAt) - new Date(msg.createdAt) > 300000);
              return (
                <motion.div
                  key={`${msg._id}-${msg.createdAt}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`group flex items-end gap-3 py-1 px-2 rounded-lg hover:bg-slate-800/20 transition ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isOwn && showAvatar && (
                    <div className="w-8 flex justify-center">
                      <img src={match.image || "/avatar.png"} alt={match.name} className="w-7 h-7 rounded-full ring-1 ring-slate-600/50" />
                    </div>
                  )}
                  <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-md lg:max-w-lg`}>
                    <div
                      className={`relative px-4 py-2.5 rounded-2xl shadow-sm border backdrop-blur-sm transition group-hover:shadow ${
                        isOwn
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/20 rounded-br-md"
                          : "bg-slate-800/60 text-slate-100 border-slate-700/40 rounded-bl-md"
                      } ${isLastInGroup ? "mb-1" : "mb-0.5"}`}
                    >
                      <p className="text-sm break-words">{msg.content}</p>
                    </div>
                    {showTimestamp && (
                      <div className="flex items-center gap-2 mt-1 px-2 opacity-0 group-hover:opacity-100 text-xs text-slate-500">
                        <Clock size={11} />
                        {formatTime(msg.createdAt)}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
        {/* message input */}
        <div className="relative px-4 py-3 max-w-3xl mx-auto w-full">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl shadow-lg"></div>
          <div className="relative">
            <MessageInput match={match} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

const EmptyChat = ({ match }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 relative min-h-96">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/8 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-amber-500/8 rounded-full blur-xl" />
    </div>
    <div className="relative z-10 max-w-sm">
      <div className="relative mb-6">
        <img src={match.image || "/avatar.png"} alt={match.name} className="w-20 h-20 rounded-full mx-auto ring-3 ring-purple-500/30 shadow" />
        {/* removed green dot */}
      </div>
      <h3 className="text-xl font-semibold text-slate-100 mb-3">
        Start a conversation with{" "}
        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-bold">{match.name}</span>
      </h3>
      <p className="text-slate-400 text-sm mb-6">This is the beginning of your conversation. Say hello and start chatting!</p>
      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
        <MessageCircle size={16} />
        Messages are end-to-end encrypted
      </div>
    </div>
  </div>
);

const MatchNotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/40 to-indigo-950/60 relative">
    <div className="text-center text-slate-300 p-4">
      <UserX size={40} className="mx-auto mb-2" />
      <h2 className="text-xl font-semibold mb-2">Conversation Not Found</h2>
      <button
        onClick={() => window.history.back()}
        className="mt-2 px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white"
      >
        Go Back
      </button>
    </div>
  </div>
);

const LoadingMessagesUI = () => (
  <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/40 to-indigo-950/60">
    <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin"></div>
  </div>
);
