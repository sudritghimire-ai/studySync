"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { UserX, ArrowLeft, Clock, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import MessageInput from "../components/MessageInput"
import { useAuthStore } from "../store/useAuthStore"
import { useMatchStore } from "../store/useMatchStore"
import { useMessageStore } from "../store/useMessageStore"
import { useSidebarStore } from "../store/useSidebarStore"
import { axiosInstance } from "../lib/axios"

// Simple throttle helper (no dependencies)
function throttle(func, limit) {
  let lastFunc
  let lastRan
  return function (...args) {
    if (!lastRan) {
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

const MAX_MESSAGES = 100 // Limit to last 100 messages

const ChatPage = () => {
  const { id: chatUserId } = useParams()
  const navigate = useNavigate()
  const { authUser } = useAuthStore()
  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore()
  const { messages, getMessages, subscribeToMessages, unsubscribeFromMessages } = useMessageStore()

  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const scrollContainerRef = useRef(null)
  const match = matches.find((m) => m?._id === chatUserId)

  // Limit messages rendered to last MAX_MESSAGES to avoid lag
  const displayedMessages = messages.slice(-MAX_MESSAGES)

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [displayedMessages.length]) // only watch limited messages

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Throttle scroll handler to run at most every 100ms
    const handleScroll = throttle(() => {
      const diff = container.scrollHeight - container.scrollTop - container.clientHeight
      const isAtBottom = diff < 50
      setShowScrollButton(!isAtBottom)
    }, 100)

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (chatUserId) {
      axiosInstance.post(`/messages/mark-seen/${chatUserId}`).catch(console.error)
    }
  }, [chatUserId])

  useEffect(() => {
    if (authUser && chatUserId) {
      getMyMatches()
      getMessages(chatUserId)
      subscribeToMessages()
    }
    return () => unsubscribeFromMessages()
  }, [getMyMatches, authUser, getMessages, subscribeToMessages, unsubscribeFromMessages, chatUserId])

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const handleBackClick = () => {
    navigate("/")
    setTimeout(() => {
      useSidebarStore.getState().openDrawer()
    }, 300)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return isNaN(date.getTime()) ? "Just now" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoadingMyMatches) return <LoadingMessagesUI />
  if (!match) return <MatchNotFound />

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Sophisticated Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-slate-600/8 to-purple-600/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-600/6 to-slate-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute top-2/3 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-600/7 to-slate-600/6 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.45, 0.25],
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 6,
          }}
        />
      </div>

      {/* Refined Glassy Header */}
      <motion.div
        className="sticky top-0 z-20 px-4 py-3"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="w-full flex items-center justify-between bg-slate-900/70 backdrop-blur-xl border border-slate-700/40 rounded-2xl shadow-2xl shadow-slate-950/50 px-6 py-4 gap-4 relative">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 to-slate-700/20 rounded-2xl" />

            {/* Left Section */}
            <div className="flex items-center gap-4 min-w-0 relative z-10">
              <motion.button
                onClick={handleBackClick}
                className="p-2.5 hover:bg-slate-700/30 rounded-xl group transition-all duration-300 border border-transparent hover:border-slate-600/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft
                  size={20}
                  className="text-slate-300 group-hover:text-slate-100 transition-colors duration-300"
                />
              </motion.button>

              <div className="flex items-center gap-4 min-w-0">
                <div className="relative">
                  <motion.img
                    src={match.image || "/avatar.png"}
                    alt={match.name}
                    className="w-12 h-12 rounded-full ring-2 ring-slate-500/40 shadow-lg flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    loading="lazy"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-sm" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-100 truncate max-w-[200px] tracking-wide">
                    {match.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">{isTyping ? "typing..." : "Active now"}</p>
                </div>
              </div>
            </div>

            {/* Premium Scroll Button */}
            <div className="flex items-center gap-2 relative z-10">
              <motion.button
                onClick={scrollToBottom}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 text-xs text-slate-200 shadow-lg font-medium border border-slate-600/30 backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                ↓ Latest
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Messages Container */}
      <motion.div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto px-3 lg:px-6 py-6 space-y-3 scrollbar-thin scrollbar-thumb-slate-600/40 scrollbar-track-transparent bg-slate-900/20 backdrop-blur-sm border-x border-slate-700/25 rounded-t-2xl shadow-inner shadow-slate-950/30 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {displayedMessages.length === 0 ? (
          <EmptyChat match={match} />
        ) : (
          <AnimatePresence>
            {displayedMessages.map((msg, index) => {
              const isOwn = msg.sender === authUser._id
              const showAvatar = !isOwn && (index === 0 || displayedMessages[index - 1]?.sender !== msg.sender)
              const isLastInGroup = index === displayedMessages.length - 1 || displayedMessages[index + 1]?.sender !== msg.sender
              const showTimestamp =
                isLastInGroup ||
                (index < displayedMessages.length - 1 &&
                  new Date(displayedMessages[index + 1]?.createdAt) - new Date(msg.createdAt) > 300000)

              // Animate only the newest message to reduce lag
              const shouldAnimate = index === displayedMessages.length - 1

              return (
                <motion.div
                  key={`${msg._id}-${msg.createdAt}`}
                  initial={shouldAnimate ? { opacity: 0, y: 15, scale: 0.98 } : {}}
                  animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
                  exit={shouldAnimate ? { opacity: 0, y: -15, scale: 0.98 } : {}}
                  transition={{
                    duration: shouldAnimate ? 0.4 : 0,
                    ease: "easeOut",
                    delay: shouldAnimate ? index * 0.03 : 0,
                  }}
                  className={`group flex items-end gap-3 py-2 px-3 rounded-xl hover:bg-slate-800/15 transition-all duration-300 ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isOwn && showAvatar && (
                    <motion.div
                      className="w-8 flex justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={match.image || "/avatar.png"}
                        alt={match.name}
                        className="w-8 h-8 rounded-full ring-1 ring-slate-600/40 shadow-md"
                        loading="lazy"
                      />
                    </motion.div>
                  )}
                  <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-md lg:max-w-lg`}>
                    <motion.div
                      className={`relative px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl ${
                        isOwn
                          ? "bg-gradient-to-br from-slate-700/90 to-slate-600/90 text-slate-100 border-slate-500/30 rounded-br-md shadow-slate-800/40"
                          : "bg-slate-800/70 text-slate-100 border-slate-600/30 rounded-bl-md shadow-slate-900/40"
                      } ${isLastInGroup ? "mb-1" : "mb-0.5"}`}
                      whileHover={shouldAnimate ? { scale: 1.01, y: -1 } : {}}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <p
                        className="text-sm break-words leading-relaxed font-medium"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {msg.content}
                      </p>

                      {/* Refined Message status indicator */}
                      {isOwn && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-100 text-xs flex items-center justify-center shadow-sm">
                          ✓
                        </div>
                      )}
                    </motion.div>

                    <AnimatePresence>
                      {showTimestamp && (
                        <motion.div
                          className="flex items-center gap-2 mt-2 px-2 opacity-0 group-hover:opacity-100 text-xs text-slate-400 transition-opacity duration-300"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          <Clock size={12} />
                          {formatTime(msg.createdAt)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Refined Message Input */}
      <motion.div
        className="relative px-3 py-4 max-w-4xl mx-auto w-full"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-b-2xl border-x border-b border-slate-700/30 shadow-slate-950/50" />
        <div className="relative">
          <MessageInput match={match} />
        </div>
      </motion.div>
    </div>
  )
}

export default ChatPage

const EmptyChat = ({ match }) => (
  <motion.div
    className="flex flex-col items-center justify-center h-full text-center p-8 relative min-h-96"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-slate-600/10 to-purple-600/10 rounded-full blur-2xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-indigo-600/8 to-slate-500/10 rounded-full blur-xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
      />
    </div>

    <div className="relative z-10 max-w-sm">
      <motion.div className="relative mb-8" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
        <img
          src={match.image || "/avatar.png"}
          alt={match.name}
          className="w-24 h-24 rounded-full mx-auto ring-4 ring-slate-500/40 shadow-2xl"
          loading="lazy"
        />
        <motion.div
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <MessageCircle size={14} className="text-white" />
        </motion.div>
      </motion.div>

      <motion.h3
        className="text-2xl font-bold text-slate-100 mb-4 tracking-wide"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Start a conversation with{" "}
        <span className="bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent font-extrabold">
          {match.name}
        </span>
      </motion.h3>

      <motion.p
        className="text-slate-400 text-base mb-8 leading-relaxed font-medium"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        This is the beginning of your conversation. Say hello and start chatting!
      </motion.p>

      <motion.div
        className="flex items-center justify-center gap-3 text-slate-400 text-sm bg-slate-800/40 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-700/40 shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <MessageCircle size={18} />
        </motion.div>
        Messages are end-to-end encrypted
      </motion.div>
    </div>
  </motion.div>
)

const MatchNotFound = () => (
  <motion.div
    className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className="text-center text-slate-300 p-8 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/40 shadow-2xl shadow-slate-950/50"
      initial={{ scale: 0.9, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}>
        <UserX size={48} className="mx-auto mb-4 text-slate-400" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-4 text-slate-100 tracking-wide">Conversation Not Found</h2>
      <p className="text-slate-400 mb-6 font-medium">
        The conversation you're looking for doesn't exist or has been removed.
      </p>
      <motion.button
        onClick={() => window.history.back()}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 text-slate-100 font-medium transition-all duration-300 shadow-lg border border-slate-600/30"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        Go Back
      </motion.button>
    </motion.div>
  </motion.div>
)

const LoadingMessagesUI = () => (
  <motion.div
    className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-center">
      <motion.div
        className="w-16 h-16 border-4 border-slate-700/50 border-t-slate-400 rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.p
        className="text-slate-400 text-lg font-medium tracking-wide"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
      >
        Loading messages...
      </motion.p>
    </div>
  </motion.div>
)
