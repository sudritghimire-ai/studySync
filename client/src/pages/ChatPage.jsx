"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "../components/Header"
import { useAuthStore } from "../store/useAuthStore"
import { useMatchStore } from "../store/useMatchStore"
import { useMessageStore } from "../store/useMessageStore"
import { Link, useParams } from "react-router-dom"
import { UserX, ArrowLeft, Clock, MessageCircle, Circle } from "lucide-react"
import MessageInput from "../components/MessageInput"
import { axiosInstance } from "../lib/axios"
import { motion } from "framer-motion"

const ChatPage = () => {
  const { id: chatUserId } = useParams()
  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore()
  const { messages, getMessages, subscribeToMessages, unsubscribeFromMessages } = useMessageStore()
  const { authUser } = useAuthStore()
  const messagesEndRef = useRef(null)
  const [showOptions, setShowOptions] = useState(false)
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false)

  const match = matches.find((m) => m?._id === chatUserId)

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

  // Reliable scroll to bottom on mount and new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        })
      }, 50)
    }
  }, [messages])

  if (isLoadingMyMatches) return <LoadingMessagesUI />

  if (!match) return <MatchNotFound />

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return isNaN(date.getTime()) ? "Just now" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getLastSeenText = () => {
    // Mock online status - replace with real data
    const isOnline = Math.random() > 0.5
    if (isOnline) return "Online"

    const lastSeen = new Date(Date.now() - Math.random() * 3600000) // Random time within last hour
    const now = new Date()
    const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60))

    if (diffMinutes < 1) return "Active now"
    if (diffMinutes < 60) return `Active ${diffMinutes}m ago`
    return `Active ${Math.floor(diffMinutes / 60)}h ago`
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-950/40 to-indigo-950/60 relative">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/2 w-64 h-64 bg-indigo-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <Header />

      {/* Single common container for header, messages, and input */}
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-grow relative z-10">
        {/* Floating Chat Header Card */}
        <div className="px-4 py-4 sticky top-0 z-20">
          <div className="flex justify-center">
            <div className="w-full flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg px-4 py-3 gap-4">
              {/* Left side - Back button, Avatar, Name & Status */}
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  to="/"
                  className="p-1.5 hover:bg-slate-700/50 rounded-lg lg:hidden group transition-all duration-200 flex-shrink-0"
                >
                  <ArrowLeft size={18} className="text-slate-400 group-hover:text-white" />
                </Link>

                <div className="relative flex-shrink-0">
                  <img
                    src={match.image || "/avatar.png"}
                    alt={match.name}
                    className="w-10 h-10 object-cover rounded-full ring-2 ring-purple-500/30 shadow-md"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full" />
                </div>

                <div className="flex flex-col min-w-0">
                  <h2 className="text-base font-semibold text-white leading-tight truncate">{match.name}</h2>
                  <div className="flex items-center gap-1">
                    <Circle size={6} className="text-green-400 fill-current flex-shrink-0" />
                    <span className="text-xs text-slate-400 truncate">{getLastSeenText()}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Match badge */}
              <div className="flex-shrink-0">
                <div className="px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-400/20 backdrop-blur-sm">
                  <span className="text-amber-300 text-xs font-medium">Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex flex-col flex-grow overflow-hidden">
          {/* Scrollable Messages with borders and background */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-1 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent bg-slate-800/20 border-l-2 border-r-2 border-slate-700/40">
            {messages.length === 0 ? (
              <EmptyChat match={match} />
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isOwn = msg.sender === authUser._id
                  const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.sender !== msg.sender)
                  const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender
                  const showTimestamp =
                    isLastInGroup ||
                    (index < messages.length - 1 &&
                      new Date(messages[index + 1]?.createdAt) - new Date(msg.createdAt) > 300000) // 5 minutes

                  return (
                    <motion.div
                      key={`${msg._id}-${msg.createdAt}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`group flex items-end gap-3 py-1 px-2 rounded-lg hover:bg-slate-800/20 transition-all duration-150 ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isOwn && (
                        <div className="w-8 flex justify-center">
                          {showAvatar ? (
                            <img
                              src={match.image || "/avatar.png"}
                              alt={match.name}
                              className="w-7 h-7 rounded-full ring-1 ring-slate-600/50"
                            />
                          ) : null}
                        </div>
                      )}

                      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-md lg:max-w-lg`}>
                        <div
                          className={`
                          relative px-4 py-2.5 rounded-2xl shadow-sm border backdrop-blur-sm
                          transition-all duration-150 group-hover:shadow-md
                          ${
                            isOwn
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/20 rounded-br-md"
                              : "bg-slate-800/60 text-slate-100 border-slate-700/40 rounded-bl-md"
                          }
                          ${isLastInGroup ? "mb-1" : "mb-0.5"}
                        `}
                        >
                          <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                        </div>

                        {showTimestamp && (
                          <div
                            className={`flex items-center gap-2 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                              isOwn ? "flex-row-reverse" : ""
                            }`}
                          >
                            <Clock size={11} className="text-slate-500" />
                            <span className="text-xs text-slate-500">{formatTime(msg.createdAt)}</span>
                            {isOwn && (
                              <div className="flex gap-1">
                                <div className="w-1 h-1 bg-amber-400/60 rounded-full" />
                                <div className="w-1 h-1 bg-amber-400/60 rounded-full" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Compact Message Input */}
          <div className="px-4 py-3">
            <div className="relative">
              {/* Compact background behind input area only */}
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg"></div>

              <div className="relative">
                <MessageInput match={match} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

const EmptyChat = ({ match }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 relative min-h-96">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/8 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-amber-500/8 rounded-full blur-xl" />
    </div>

    <div className="relative z-10 max-w-sm">
      <div className="relative mb-6">
        <img
          src={match.image || "/avatar.png"}
          alt={match.name}
          className="w-20 h-20 rounded-full mx-auto ring-3 ring-purple-500/30 shadow-lg"
        />
        <div className="absolute -bottom-1 -right-6 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full" />
      </div>

      <h3 className="text-xl font-semibold text-slate-100 mb-3">
        Start a conversation with{" "}
        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-bold">
          {match.name}
        </span>
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        This is the beginning of your conversation. Say hello and start chatting!
      </p>

      <div className="flex items-center justify-center gap-2 text-slate-500">
        <MessageCircle size={16} />
        <span className="text-xs">Messages are end-to-end encrypted</span>
      </div>
    </div>
  </div>
)

const MatchNotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/40 to-indigo-950/60 relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl"></div>
    </div>

    <div className="relative z-10 p-8 rounded-2xl bg-slate-800/80 backdrop-blur-xl text-center border border-slate-700/50 shadow-xl max-w-md mx-4">
      <UserX size={48} className="text-slate-400 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-slate-100 mb-3">Conversation Not Found</h2>
      <p className="text-slate-400 mb-6 text-sm leading-relaxed">
        This conversation doesn't exist or may have been removed.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium"
      >
        <ArrowLeft size={16} />
        Back to Chats
      </Link>
    </div>
  </div>
)

const LoadingMessagesUI = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/40 to-indigo-950/60">
    <div className="relative">
      <div className="w-10 h-10 border-3 border-slate-700/30 border-t-amber-500 rounded-full animate-spin"></div>
      <div
        className="absolute inset-0 w-10 h-10 border-3 border-transparent border-t-purple-500/50 rounded-full animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      ></div>
    </div>
    <p className="text-slate-300 mt-4 text-sm">Loading conversation...</p>
  </div>
)
