"use client"

import TinderCard from "react-tinder-card"
import { useMatchStore } from "../store/useMatchStore"
import { MessageCircle, ChevronLeft, ChevronRight, GraduationCap, BookOpen } from "lucide-react"

const SwipeArea = () => {
  const { userProfiles, swipeRight, swipeLeft } = useMatchStore()

  const handleSwipe = (dir, user) => {
    if (dir === "right") swipeRight(user)
    else if (dir === "left") swipeLeft(user)
  }

  const handleQuickConnect = (user, e) => {
    e.stopPropagation()
    // Handle quick connect logic
    console.log("Quick connect with:", user.name)
  }

  return (
    <>
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4);
          }
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes swipe-hint-left {
          0%, 100% {
            transform: translateX(0px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateX(-8px) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes swipe-hint-right {
          0%, 100% {
            transform: translateX(0px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateX(8px) scale(1.1);
            opacity: 1;
          }
        }

        .profile-ring::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #06b6d4, #8b5cf6);
          z-index: -1;
          animation: pulse-ring 2s infinite;
        }

        .profile-ring::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #06b6d4);
          z-index: -1;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .glassmorphism-card {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .quick-connect-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .quick-connect-btn:hover {
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          transform: translateY(-2px) scale(1.05);
        }

        .swipe-indicator-left {
          animation: swipe-hint-left 3s ease-in-out infinite;
        }

        .swipe-indicator-right {
          animation: swipe-hint-right 3s ease-in-out infinite;
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(139, 92, 246, 0.2);
        }

        .shimmer-text {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s infinite;
        }

        .academic-badge {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
          border: 1px solid rgba(139, 92, 246, 0.3);
          backdrop-filter: blur(10px);
        }
      `}</style>

<div className="relative w-full max-w-sm mx-auto mt-[-220px]">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 rounded-3xl blur-3xl"></div>

        {userProfiles.map((user, index) => (
          <TinderCard
            className="absolute"
            key={user._id}
            onSwipe={(dir) => handleSwipe(dir, user)}
            swipeRequirementType="position"
            swipeThreshold={100}
            preventSwipe={["up", "down"]}
          >
<div className="w-full select-none relative card-hover pb-8 h-[540px]">
              {/* Main Card Container */}
              <div className="glassmorphism-card rounded-3xl h-full shadow-2xl relative overflow-hidden">
                {/* Swipe Indicators */}
                <div className="absolute top-6 left-6 z-20 swipe-indicator-left">
                  <div className="p-2 bg-red-500/20 rounded-full border border-red-400/30 backdrop-blur-sm">
                    <ChevronLeft className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <div className="absolute top-6 right-6 z-20 swipe-indicator-right">
                  <div className="p-2 bg-green-500/20 rounded-full border border-green-400/30 backdrop-blur-sm">
                    <ChevronRight className="w-5 h-5 text-green-400" />
                  </div>
                </div>

                {/* Academic Status Badge */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="academic-badge px-3 py-1 rounded-full flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-medium text-slate-300">Student</span>
                  </div>
                </div>

                {/* Profile Image Section */}
                <div className="flex flex-col items-center pt-20 pb-6">
                  <div className="relative profile-ring">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 shadow-2xl border-4 border-slate-600/50">
                      <img
                        src={user.image || "/placeholder.svg?height=128&width=128"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Quick Connect Button */}
                  <button
                    onClick={(e) => handleQuickConnect(user, e)}
                    className="absolute top-[200px] right-8 p-3 quick-connect-btn bg-slate-800/80 backdrop-blur-sm rounded-full border border-purple-500/30 shadow-lg z-10"
                  >
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                  </button>
                </div>

                {/* User Information */}
                <div className="px-8 pb-8 space-y-4">
                  {/* Name and Age */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold shimmer-text mb-1">{user.name}</h2>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg text-cyan-400 font-semibold">{user.age}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-slate-400">{user.major || "SpringFallUSA"}</span>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-slate-300">About</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                      {user.bio || "Looking for study partners and academic connections. Let's learn together!"}
                    </p>
                  </div>

                  {/* Academic Interests */}
                  {user.interests && user.interests.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-slate-300">Academic Interests</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.slice(0, 4).map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-400/30 backdrop-blur-sm"
                          >
                            {interest}
                          </span>
                        ))}
                        {user.interests.length > 4 && (
                          <span className="px-3 py-1.5 bg-slate-700/50 text-slate-400 text-xs font-medium rounded-full border border-slate-600/50">
                            +{user.interests.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>


                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>

                {/* Subtle Border Glow */}
                <div className="absolute inset-0 rounded-3xl border border-purple-500/20 pointer-events-none"></div>
              </div>
            </div>
          </TinderCard>
        ))}

        {/* No More Cards Message */}
        {userProfiles.length === 0 && (
          <div className="glassmorphism-card rounded-3xl h-full flex flex-col items-center justify-center text-center p-8">
            <GraduationCap className="w-16 h-16 text-purple-400 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-slate-200 mb-2">No More Profiles</h3>
            <p className="text-slate-400 text-sm">
              You've seen all available study partners in your area. Check back later for new connections!
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default SwipeArea
