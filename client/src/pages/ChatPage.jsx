"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "../components/Header"
import { useAuthStore } from "../store/useAuthStore"
import { useMatchStore } from "../store/useMatchStore"
import { useMessageStore } from "../store/useMessageStore"
import { Link, useParams } from "react-router-dom"
import { UserX, ArrowLeft, Clock, MessageCircle, Heart } from "lucide-react"
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end"
    })
  }, [messages])

  if (isLoadingMyMatches) return <LoadingMessagesUI />
  if (!match) return <MatchNotFound />

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return isNaN(date.getTime())
      ? "Just now"
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-violet-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header />

      {/* Chat header */}
      <div className="bg-transparent px-4 py-3 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-purple-700/50 rounded-xl lg:hidden group"
              >
                <ArrowLeft size={20} className="text-purple-200 group-hover:text-white" />
              </Link>
              <div className="relative">
                <img
                  src={match.image || "/avatar.png"}
                  alt={match.name}
                  className="w-12 h-12 object-cover rounded-full ring-3 ring-amber-400/50 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-purple-800 rounded-full animate-pulse" />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-white">{match.name}</h2>
              </div>
            </div>
            <div className="px-3 py-1 bg-amber-400/20 rounded-full border border-amber-400/30">
              <span className="text-amber-300 text-sm font-medium">Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages and input */}
      <div className="flex flex-col flex-grow w-full relative z-10 overflow-hidden">
        {/* scrollable messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <EmptyChat match={match} />
          ) : (
            <>
              {messages.map((msg, index) => {
                const isOwn = msg.sender === authUser._id
                const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.sender !== msg.sender)
                const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender

                return (
                  <motion.div
                    key={`${msg._id}-${msg.createdAt}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-end gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    {!isOwn && showAvatar && (
                      <img
                        src={match.image || "/avatar.png"}
                        alt={match.name}
                        className="w-8 h-8 rounded-full ring-2 ring-purple-600/50 shadow-md"
                      />
                    )}
                    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-xs lg:max-w-md`}>
                      <div className={`
                        relative px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl backdrop-blur-sm
                        ${isOwn
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md border border-amber-400/30"
                          : "bg-purple-800/80 text-purple-100 border border-purple-600/30 rounded-bl-md"}
                        ${isLastInGroup ? "mb-2" : "mb-1"}
                      `}>
                        <p className="text-sm break-words">{msg.content}</p>
                        <div className={`
                          absolute bottom-0 w-3 h-3 transform rotate-45
                          ${isOwn
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 -right-1 border-r border-b border-amber-400/30"
                            : "bg-purple-800/80 -left-1 border-r border-b border-purple-600/30"}
                        `}/>
                      </div>
                      {isLastInGroup && (
                        <div className={`flex items-center gap-2 mt-1 px-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                          <Clock size={12} className="text-purple-400" />
                          <span className="text-xs text-purple-300">{formatTime(msg.createdAt)}</span>
                          {isOwn && (
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-100" />
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

        {/* pinned MessageInput */}
        <div className="bg-transparent px-4 py-3 w-full">
          <MessageInput match={match} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage

const EmptyChat = ({ match }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 relative">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
    </div>
    <div className="relative z-10 max-w-sm">
      <img
        src={match.image || "/avatar.png"}
        alt={match.name}
        className="w-24 h-24 rounded-full mx-auto ring-4 ring-amber-400/50 shadow-xl mb-4"
      />
      <h3 className="text-2xl font-bold text-purple-100 mb-4">
        Say hello to <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">{match.name}</span>!
      </h3>
      <p className="text-purple-300 mb-8">This is the beginning of your conversation. Be friendly and start chatting! ✨</p>
    </div>
  </div>
)

const MatchNotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950 relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/5 rounded-full blur-2xl animate-pulse"></div>
    </div>
    <div className="relative z-10 p-8 rounded-3xl bg-purple-800/80 text-center border border-purple-600/30 shadow-2xl max-w-md mx-4">
      <UserX size={64} className="text-amber-400 mb-4" />
      <h2 className="text-3xl font-bold text-purple-100 mb-4">User Not Found</h2>
      <p className="text-purple-300 mb-8">This conversation doesn't exist or the user has been removed.</p>
      <Link to="/" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:scale-105 transition-all">Back to Chats</Link>
    </div>
  </div>
)

const LoadingMessagesUI = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950">
    <div className="w-12 h-12 border-4 border-purple-600/30 border-t-amber-400 rounded-full animate-spin mb-4"></div>
    <p className="text-purple-100">Loading messages...</p>
  </div>
)
