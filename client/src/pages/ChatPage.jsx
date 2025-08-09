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
      {/* ... background and header remain unchanged ... */}

      <motion.div
        className="relative flex-1 overflow-y-auto px-3 lg:px-6 py-6 space-y-3 scrollbar-thin scrollbar-thumb-slate-600/40 scrollbar-track-transparent bg-slate-900/20 backdrop-blur-sm border-x border-slate-700/25 rounded-t-2xl shadow-inner shadow-slate-950/30 max-w-4xl mx-auto"
        ref={scrollContainerRef}
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
                        loading="lazy" // lazy-load images
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

      {/* Message input remains unchanged */}
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

// ... other components remain unchanged
