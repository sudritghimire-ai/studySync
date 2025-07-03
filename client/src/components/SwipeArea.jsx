"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TinderCard from "react-tinder-card"
import { MessageCircle, GraduationCap, BookOpen, Users, MapPin } from "lucide-react"
import { useMatchStore } from "../store/useMatchStore"

const SwipeArea = () => {
  const { userProfiles, swipeRight, swipeLeft, getUserProfiles } = useMatchStore()
  const [visibleCards, setVisibleCards] = useState([])
  const [nextIndex, setNextIndex] = useState(1)
const [isReloading, setIsReloading] = useState(false);

  // Initialize visible cards
  useEffect(() => {
    setVisibleCards(userProfiles.slice(0, 1))
    setNextIndex(1)
  }, [userProfiles])

  // Auto-reload when stack is empty
 useEffect(() => {
  const shouldReload =
    visibleCards.length === 0 &&
    nextIndex >= userProfiles.length &&
    userProfiles.length > 0;

  if (shouldReload && !isReloading) {
    setIsReloading(true);
    getUserProfiles().finally(() => setIsReloading(false));
  }
}, [visibleCards.length, nextIndex, userProfiles.length, getUserProfiles, isReloading]);


  const handleSwipe = (dir, user) => {
    if (dir === "right") swipeRight(user)
    else swipeLeft(user)

    setVisibleCards((prev) => prev.slice(1)) // Remove swiped card

    // Add next card if available
    if (nextIndex < userProfiles.length) {
      setVisibleCards((prev) => [...prev, userProfiles[nextIndex]])
      setNextIndex((prev) => prev + 1)
    }
  }

  const handleQuickConnect = (user, e) => {
    e.stopPropagation()
    console.log("Quick connect with", user.name)
  }

  const handleKeyDown = (e, user) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleQuickConnect(user, e)
    }
  }

  return (
<div className="relative w-full max-w-md mx-auto mt-[-220px] px-4">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 -inset-x-8 -inset-y-8">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/8 to-purple-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-500/6 to-blue-500/8 rounded-full blur-2xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Card Stack */}
      <div className="relative">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{
                scale: 1 - index * 0.02,
                opacity: 1 - index * 0.1,
                y: index * 8,
                zIndex: visibleCards.length - index,
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                y: -50,
                transition: { duration: 0.3 },
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              className="absolute inset-0"
            >
              <TinderCard
                onSwipe={(dir) => handleSwipe(dir, user)}
                swipeRequirementType="position"
                swipeThreshold={100}
                preventSwipe={["up", "down"]}
                className="w-full h-full"
              >
                <ProfileCard
                  user={user}
                  onQuickConnect={handleQuickConnect}
                  onKeyDown={handleKeyDown}
                  isTopCard={index === 0}
                />
              </TinderCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading State - shows when reloading new profiles */}
        {isReloading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingState />
          </motion.div>
        )}

        {/* Empty State - only shows when no profiles available initially */}
        {userProfiles.length === 0 && !isReloading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EmptyState />
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Loading state component for when fetching new profiles
const LoadingState = () => (
  <div className="relative h-[540px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
      {/* Animated Loading Icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <GraduationCap className="w-16 h-16 text-indigo-400" />
      </motion.div>

      {/* Loading Text */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-200 tracking-wide">Finding New Connections</h3>
        <motion.p
          className="text-slate-400 text-sm leading-relaxed max-w-xs"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          Discovering more academic partners for you...
        </motion.p>
      </div>
    </div>
  </div>
)

// Extracted ProfileCard component for better maintainability
const ProfileCard = ({ user, onQuickConnect, onKeyDown, isTopCard }) => {
  return (
  <motion.div
  className="w-full select-none relative h-[520px] group"
      whileHover={
        isTopCard
          ? {
              y: -8,
              scale: 1.01,
              transition: { duration: 0.3, ease: "easeOut" },
            }
          : {}
      }
    >
      {/* Main Card Container */}
      <div className="relative h-full rounded-[32px] overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-[2px] border-slate-600/50"
>
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 via-transparent to-slate-900/20 pointer-events-none" />

        {/* Academic Badge */}
        <motion.div
          className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 px-4 py-2 rounded-full flex items-center gap-2 bg-slate-800/80 border border-slate-600/50 backdrop-blur-sm shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-200 tracking-wide">Academic Partner</span>
        </motion.div>

        {/* Profile Section */}
        <div className="flex flex-col items-center pt-20 pb-6">
          {/* Enhanced Profile Picture with Animated Ring */}
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          >
            {/* Animated Ring Effect */}
            <div className="absolute inset-0 rounded-full">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-cyan-500/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                style={{ padding: "4px" }}
              />
              <motion.div
                className="absolute inset-1 rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-500/30 blur-sm"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </div>

            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 shadow-2xl border-4 border-slate-600/50 z-10">
              <img
                src={user.image || "/placeholder.svg?height=128&width=128"}
                alt={`${user.name}'s profile picture`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Quick Connect Button */}
          <motion.button
            onClick={(e) => onQuickConnect(user, e)}
            onKeyDown={(e) => onKeyDown(e, user)}
            className="absolute top-[200px] right-8 p-3 bg-slate-800/90 backdrop-blur-sm rounded-full border border-indigo-500/40 shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600/80 hover:to-purple-600/80 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Quick connect with ${user.name}`}
            tabIndex={isTopCard ? 0 : -1}
          >
            <MessageCircle className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors duration-300" />
          </motion.button>
        </div>

        {/* User Information */}
        <motion.div
className="px-10 pb-10 space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Name and Basic Info */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-100 tracking-wide">{user.name}</h2>
            <div className="flex items-center justify-center gap-3 text-slate-400 text-sm">
              <span className="font-medium">{user.age}</span>
              <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{user.major || "SpringFallUSA"}</span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
  <motion.div
  className="w-full max-w-[420px] mx-auto bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/40 shadow-inner pointer-events-none"
  whileHover={{
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    transition: { duration: 0.3 },
  }}
>

  <div className="flex items-center gap-2 mb-3 pointer-events-auto">
    <BookOpen className="w-4 h-4 text-indigo-400" />
    <span className="text-sm font-semibold text-slate-200">About</span>
  </div>
  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words pointer-events-auto">
    {user.bio || "Excited to connect and collaborate on studies!"}
  </p>
</motion.div>


          {/* Academic Interests */}
          {user.interests?.length > 0 && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-slate-200">Academic Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.interests.slice(0, 4).map((interest, idx) => (
                  <motion.span
                    key={idx}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 text-xs font-medium rounded-full border border-indigo-400/30 backdrop-blur-sm shadow-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 + idx * 0.1, duration: 0.3 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(99, 102, 241, 0.3)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    {interest}
                  </motion.span>
                ))}
                {user.interests.length > 4 && (
                  <motion.span
                    className="px-3 py-1.5 bg-slate-700/60 text-slate-400 text-xs font-medium rounded-full border border-slate-600/50 backdrop-blur-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.3 }}
                  >
                    +{user.interests.length - 4} more
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  )
}

// Extracted EmptyState component
const EmptyState = () => (
  <div className="relative h-[540px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
      {/* Animated Icon */}
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <GraduationCap className="w-20 h-20 text-indigo-400/60" />
      </motion.div>

      {/* Text Content */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-slate-200 tracking-wide">No More Profiles</h3>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
          You've explored all available study partners in your area. Check back later for new academic connections!
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="flex items-center gap-2 text-slate-500 text-xs">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Users className="w-4 h-4" />
        </motion.div>
        <span>Building academic communities</span>
      </div>
    </div>
  </div>
)

export default SwipeArea
