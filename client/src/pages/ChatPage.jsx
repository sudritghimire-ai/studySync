"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserX, ArrowLeft, Clock, MessageCircle, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
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
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
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
      const isAtBottom = diff < 50;
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
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-950/40 to-indigo-950/60 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-2/3 left-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Enhanced Floating Header */}
      <motion.div 
        className="sticky top-0 z-20 px-4 py-2"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="w-full flex items-center justify-between bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-2xl shadow-2xl px-6 py-4 gap-4 relative">
            {/* Left Section */}
            <div className="flex items-center gap-4 min-w-0">
              <motion.button
                onClick={handleBackClick}
                className="p-2 hover:bg-slate-700/50 rounded-xl group transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={20} className="text-slate-400 group-hover:text-white transition-colors" />
              </motion.button>
              
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative">
                  <motion.img 
                    src={match.image || "/avatar.png"} 
                    alt={match.name} 
                    className="w-12 h-12 rounded-full ring-2 ring-purple-500/40 shadow-lg flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-100 truncate max-w-[200px]">
                    {match.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isTyping ? "typing..." : "Active now"}
                  </p>
                </div>
              </div>
            </div>

         <div className="flex items-center gap-2">
  <motion.button
    onClick={scrollToBottom}
    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xs text-white shadow-lg font-medium"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    ↓ Scroll to Latest
  </motion.button>
</div>

          </div>
        </div>
      </motion.div>

      {/* Enhanced Messages Container */}
      <div className="flex flex-col flex-grow relative z-10 max-w-4xl mx-auto w-full overflow-hidden px-4">
        <motion.div
          ref={scrollContainerRef}
          className="relative flex-1 overflow-y-auto px-2 lg:px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent bg-slate-800/10 backdrop-blur-sm border-x border-slate-700/30 rounded-t-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {messages.length === 0 ? (
            <EmptyChat match={match} />
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => {
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
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeOut",
                      delay: index * 0.05 
                    }}
                    className={`group flex items-end gap-3 py-2 px-3 rounded-xl hover:bg-slate-800/20 transition-all duration-200 ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isOwn && showAvatar && (
                      <motion.div 
                        className="w-8 flex justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <img 
                          src={match.image || "/avatar.png"} 
                          alt={match.name} 
                          className="w-8 h-8 rounded-full ring-1 ring-slate-600/50 shadow-md" 
                        />
                      </motion.div>
                    )}

                    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-md lg:max-w-lg`}>
                      <motion.div
                        className={`relative px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-200 group-hover:shadow-xl ${
                          isOwn
                            ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white border-amber-400/30 rounded-br-md shadow-amber-500/20"
                            : "bg-slate-800/80 text-slate-100 border-slate-700/50 rounded-bl-md shadow-slate-900/50"
                        } ${isLastInGroup ? "mb-1" : "mb-0.5"}`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm break-words leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>
                          {msg.content}
                        </p>
                        
                        {/* Message status indicator for own messages */}
                        {isOwn && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white text-xs flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </motion.div>

                      <AnimatePresence>
                        {showTimestamp && (
                          <motion.div 
                            className="flex items-center gap-2 mt-2 px-2 opacity-0 group-hover:opacity-100 text-xs text-slate-500 transition-opacity duration-200"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Clock size={12} />
                            {formatTime(msg.createdAt)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Enhanced Message Input */}
        <motion.div 
          className="relative px-2 py-4 max-w-4xl mx-auto w-full"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-2xl shadow-2xl rounded-b-2xl border-x border-b border-slate-700/30" />
          <div className="relative">
            <MessageInput match={match} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;

const EmptyChat = ({ match }) => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full text-center p-8 relative min-h-96"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className="absolute inset-0 pointer-events-none">
      <motion.div 
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </div>
    
    <div className="relative z-10 max-w-sm">
      <motion.div 
        className="relative mb-8"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <img 
          src={match.image || "/avatar.png"} 
          alt={match.name} 
          className="w-24 h-24 rounded-full mx-auto ring-4 ring-purple-500/40 shadow-2xl" 
        />
        <motion.div 
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MessageCircle size={14} className="text-white" />
        </motion.div>
      </motion.div>

      <motion.h3 
        className="text-2xl font-bold text-slate-100 mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Start a conversation with{" "}
        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent font-extrabold">
          {match.name}
        </span>
      </motion.h3>
      
      <motion.p 
        className="text-slate-400 text-base mb-8 leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        This is the beginning of your conversation. Say hello and start chatting!
      </motion.p>

      <motion.div 
        className="flex items-center justify-center gap-3 text-slate-500 text-sm bg-slate-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-700/50"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <MessageCircle size={18} />
        </motion.div>
        Messages are end-to-end encrypted
      </motion.div>
    </div>
  </motion.div>
);

const MatchNotFound = () => (
  <motion.div 
    className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/40 to-indigo-950/60 relative"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div 
      className="text-center text-slate-300 p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl"
      initial={{ scale: 0.8, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <UserX size={48} className="mx-auto mb-4 text-red-400" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-4">Conversation Not Found</h2>
      <p className="text-slate-400 mb-6">The conversation you're looking for doesn't exist or has been removed.</p>
      <motion.button
        onClick={() => window.history.back()}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-medium transition-all duration-200 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Go Back
      </motion.button>
    </motion.div>
  </motion.div>
);

const LoadingMessagesUI = () => (
  <motion.div 
    className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/40 to-indigo-950/60"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center">
      <motion.div 
        className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p 
        className="text-slate-400 text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading messages...
      </motion.p>
    </div>
  </motion.div>
);
