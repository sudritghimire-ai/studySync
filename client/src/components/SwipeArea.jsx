"use client";

import TinderCard from "react-tinder-card";
import { useMatchStore } from "../store/useMatchStore";
import { useEffect, useState } from "react";
import { MessageCircle, GraduationCap, BookOpen } from "lucide-react";

const SwipeArea = () => {
  const { userProfiles, swipeRight, swipeLeft } = useMatchStore();

  // only 3 cards in view
  const [visibleCards, setVisibleCards] = useState([]);
  const [nextIndex, setNextIndex] = useState(3);

  // initialize visible cards
  useEffect(() => {
    setVisibleCards(userProfiles.slice(0, 3));
    setNextIndex(3);
  }, [userProfiles]);

  const handleSwipe = (dir, user) => {
    if (dir === "right") swipeRight(user);
    else swipeLeft(user);

    setVisibleCards((prev) => prev.slice(1)); // remove swiped card
    if (nextIndex < userProfiles.length) {
      setVisibleCards((prev) => [...prev, userProfiles[nextIndex]]);
      setNextIndex((prev) => prev + 1);
    }
  };

  const handleQuickConnect = (user, e) => {
    e.stopPropagation();
    console.log("Quick connect with", user.name);
  };

  return (
    <>
      <style jsx>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%,100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4); }
        }
        .profile-ring::before {
          content: ''; position: absolute; top:-4px; left:-4px; right:-4px; bottom:-4px;
          border-radius:50%; background:linear-gradient(45deg,#8b5cf6,#06b6d4,#8b5cf6);
          z-index:-1; animation:pulse-ring 2s infinite;
        }
        .profile-ring::after {
          content: ''; position: absolute; top:-2px; left:-2px; right:-2px; bottom:-2px;
          border-radius:50%; background:linear-gradient(45deg,#8b5cf6,#06b6d4);
          z-index:-1; animation:glow-pulse 3s ease-in-out infinite;
        }
        .glassmorphism-card {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
        }
        .quick-connect-btn:hover {
          background:linear-gradient(135deg,#8b5cf6,#06b6d4);
          transform: translateY(-2px) scale(1.05);
        }
        .card-hover:hover {
          transform:translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.4), 0 0 40px rgba(139,92,246,0.2);
        }
      `}</style>

      <div className="relative w-full max-w-sm mx-auto mt-[-220px]">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 rounded-3xl blur-3xl"></div>

        {visibleCards.map((user) => (
          <TinderCard
            key={user._id}
            onSwipe={(dir) => handleSwipe(dir, user)}
            swipeRequirementType="position"
            swipeThreshold={100}
            preventSwipe={["up", "down"]}
            className="absolute"
          >
            <div className="w-full select-none relative card-hover pb-8 h-[540px]">
              <div className="glassmorphism-card rounded-3xl h-full shadow-2xl relative overflow-hidden">

                {/* Badge */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 px-3 py-1 rounded-full flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 backdrop-blur-sm">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-slate-300">Student</span>
                </div>

                {/* Profile */}
                <div className="flex flex-col items-center pt-20 pb-6">
                  <div className="relative profile-ring">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 shadow-2xl border-4 border-slate-600/50">
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleQuickConnect(user, e)}
                    className="absolute top-[200px] right-8 p-3 quick-connect-btn bg-slate-800/80 backdrop-blur-sm rounded-full border border-purple-500/30 shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                  </button>
                </div>

                {/* Info */}
                <div className="px-8 pb-8 space-y-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-200 mb-1">{user.name}</h2>
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                      <span>{user.age}</span>
                      <span>•</span>
                      <span>{user.major || "SpringFallUSA"}</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-slate-300">About</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                      {user.bio || "Looking for study partners and academic connections. Let's learn together!"}
                    </p>
                  </div>
                  {user.interests?.length > 0 && (
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

                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </TinderCard>
        ))}

        {/* no more cards */}
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
  );
};

export default SwipeArea;
