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
  const [isReloading, setIsReloading] = useState(false)

  // initialize visible cards
  useEffect(() => {
    setVisibleCards(userProfiles.slice(0, 1))
    setNextIndex(1)
  }, [userProfiles])

  useEffect(() => {
    const shouldReload =
      visibleCards.length === 0 &&
      nextIndex >= userProfiles.length &&
      userProfiles.length > 1
    if (shouldReload && !isReloading) {
      setIsReloading(true)
      getUserProfiles().finally(() => setIsReloading(false))
    }
  }, [visibleCards.length, nextIndex, userProfiles.length, getUserProfiles, isReloading])

  const handleSwipe = (dir, user) => {
    if (dir === "right") swipeRight(user)
    else swipeLeft(user)
    setVisibleCards((prev) => prev.slice(1))
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

  const shouldShowOneUserFallback =
    userProfiles.length === 1 && visibleCards.length === 0

  const shouldShowEmptyFallback =
    userProfiles.length === 0 && !isReloading

  return (
    <div className="relative w-full max-w-md mx-auto mt-[-220px] px-4">
      <div className="absolute inset-0 -inset-x-8 -inset-y-8 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/8 to-purple-500/8 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-500/6 to-blue-500/8 rounded-full blur-2xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

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
              exit={{ scale: 0.8, opacity: 0, y: -50, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
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

        {isReloading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingState />
          </motion.div>
        )}

        {shouldShowEmptyFallback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EmptyState />
          </motion.div>
        )}

        {shouldShowOneUserFallback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <OnlyOneUserFallback />
          </motion.div>
        )}
      </div>
    </div>
  )
}

const OnlyOneUserFallback = () => (
  <div className="relative h-[540px] rounded-3xl overflow-hidden bg-slate-900/95 border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center p-8 text-center space-y-4">
    <GraduationCap className="w-16 h-16 text-indigo-400 mb-4" />
    <h3 className="text-xl font-bold text-slate-200">SpringFallUSA</h3>
    <p className="text-slate-400 text-sm">
      Whoa, quick searcher! You’ve checked out all available study partners for now.
      Take a short break and come back later to find new buddies! 📚✨
    </p>
  </div>
)

const EmptyState = () => (
  <div className="relative h-[540px] rounded-3xl overflow-hidden bg-slate-900/95 border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center p-8 text-center space-y-4">
    <GraduationCap className="w-16 h-16 text-indigo-400 mb-4" />
    <h3 className="text-xl font-bold text-slate-200">No Profiles Available</h3>
    <p className="text-slate-400 text-sm">
      There are no study partners available at the moment. Check back later to discover more!
    </p>
  </div>
)

const LoadingState = () => (
  <div className="relative h-[540px] rounded-3xl overflow-hidden bg-slate-900/95 border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center p-8 text-center space-y-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <GraduationCap className="w-16 h-16 text-indigo-400" />
    </motion.div>
    <p className="text-slate-400">Finding more academic partners for you...</p>
  </div>
)

const ProfileCard = ({ user, onQuickConnect, onKeyDown, isTopCard }) => (
  <motion.div
    className="w-full select-none relative h-[520px] group"
    whileHover={
      isTopCard
        ? { y: -8, scale: 1.01, transition: { duration: 0.3 } }
        : {}
    }
  >
    <div className="relative h-full rounded-[32px] overflow-hidden shadow-2xl bg-slate-900/95 border-[2px] border-slate-600/50">
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-600/50 shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <GraduationCap className="w-4 h-4 text-indigo-400" />
        <span className="text-xs text-slate-200 ml-1">Academic Partner</span>
      </motion.div>
      <div className="flex flex-col items-center pt-20 pb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-800 border-4 border-slate-600 shadow-2xl">
          <img
            src={user.image || "/placeholder.svg"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={(e) => onQuickConnect(user, e)}
          onKeyDown={(e) => handleKeyDown(e, user)}
          className="absolute top-[200px] right-8 p-3 rounded-full bg-slate-800/90 border border-indigo-500 shadow-lg"
          aria-label={`Quick connect with ${user.name}`}
        >
          <MessageCircle className="w-5 h-5 text-indigo-400" />
        </button>
      </div>
      <div className="px-10 pb-10 space-y-4 text-center">
        <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
        <p className="text-slate-400 text-sm">{user.bio || "Excited to connect and study!"}</p>
        {user.interests?.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {user.interests.slice(0, 4).map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </motion.div>
)

export default SwipeArea
