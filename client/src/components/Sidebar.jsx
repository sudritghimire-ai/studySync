"use client";

import { useEffect, useState } from "react";
import { Heart, Loader, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import { io } from "socket.io-client";

// 👇 adjust if needed
const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");

const Sidebar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();

  useEffect(() => {
    getMyMatches();

    // listen for any new messages
    socket.on("newMessage", () => {
      getMyMatches();
    });

    return () => {
      socket.off("newMessage");
    };
  }, [getMyMatches]);

  const filteredMatches = matches
  .filter((match) =>
    match.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (a.hasNewMessage && !b.hasNewMessage) return -1;
    if (!a.hasNewMessage && b.hasNewMessage) return 1;
    return 0;
  });

  return (
    <>
      {/* Floating Toggle Button */}
     <button
  data-sidebar-toggle
  className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full shadow-lg hover:scale-105 transition"
  onClick={toggleDrawer}
>
  <MessageCircle size={22} />
</button>

      {/* Drawer */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          max-h-[90vh] overflow-hidden
          bg-gradient-to-b from-purple-900/95 to-violet-900/95
          backdrop-blur-xl border-t border-purple-700/50
          rounded-t-2xl shadow-2xl px-4 pt-5 pb-6
          transform transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-purple-700/40">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
              Matches
            </h2>
          </div>
          <button
            onClick={toggleDrawer}
            className="p-2 text-purple-300 hover:text-white"
          >
            <X />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search matches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-purple-800/40 border border-purple-600/40 text-purple-100 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
        </div>

        {/* Match List */}
        <div
          className={`space-y-3 mt-4 ${
            filteredMatches.length > 6 ? "max-h-[300px] overflow-y-auto" : ""
          }`}
        >
          {isLoadingMyMatches ? (
            <LoadingState />
          ) : filteredMatches.length === 0 ? (
            <NoMatchesFound />
          ) : (
            filteredMatches.map((match, index) => (
              <Link
                key={match._id}
                to={`/chat/${match._id}`}
                onClick={toggleDrawer}
              >
                <div
                  className="group flex items-center p-3 rounded-xl hover:bg-purple-800/50 transition"
                >
                  <div className="relative">
                    <img
                      src={match.image || "/avatar.png"}
                      alt="User avatar"
                      className="w-12 h-12 rounded-full mr-4 border-2 border-purple-600 group-hover:border-amber-400 transition"
                    />
                    {/* NEW message badge */}
                    {match.hasNewMessage && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-ping">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-purple-100 font-semibold group-hover:text-white truncate">
                      {match.name}
                    </h3>
                  {match.hasNewMessage ? (
  <p className="text-sm text-red-400 font-semibold">New Chat</p>
) : match.hasUnseenByReceiver ? (
  <p className="text-sm text-yellow-400 font-semibold">Message Sent</p>
) : (
  <p className="text-sm text-purple-300 group-hover:text-purple-200">Tap to chat</p>
)}

                  </div>
                  <MessageCircle className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="w-full text-center border-t border-purple-700/40 pt-4 mt-4 text-xs text-purple-300">
          <span className="font-semibold text-amber-300">{matches.length}</span>{" "}
          matches found
        </div>
      </div>
    </>
  );
};

export default Sidebar;

const NoMatchesFound = () => (
  <div className="text-center text-purple-300 py-8 animate-fade-in">
    <Heart className="text-amber-400 animate-pulse mx-auto mb-4" size={36} />
    <h3 className="text-lg font-semibold text-purple-100 mb-1">No Matches Yet</h3>
    <p className="text-sm max-w-xs mx-auto">
      Keep exploring — your perfect match could be just a swipe away! ✨
    </p>
  </div>
);

const LoadingState = () => (
  <div className="text-center text-purple-300 py-8 animate-fade-in">
    <Loader className="text-amber-400 animate-spin mx-auto mb-4" size={36} />
    <h3 className="text-lg font-semibold text-purple-100 mb-1">
      Finding Your Matches...
    </h3>
    <p className="text-sm max-w-xs mx-auto">
      Hang tight, we’re searching the galaxy for your connections!
    </p>
  </div>
);
