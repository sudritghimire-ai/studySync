"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Book, User, LogOut, Menu, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock auth store for demo - replace with your actual store
const useAuthStore = () => ({
  authUser: { name: "John Doe", image: "/avatar.png", token: "mock-token" },
  logout: () => console.log("Logout"),
})

export const Header = () => {
  const { authUser, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false)
        setMobileUserDropdownOpen(false)
      }
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false)
        setMobileMenuOpen(false)
        setMobileUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  return (
    <header className="bg-gradient-to-r from-slate-900/98 via-gray-900/98 to-slate-800/98 backdrop-blur-2xl border-b border-slate-700/50 shadow-2xl relative">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>

      {/* Professional grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
        {/* Mobile Layout */}
        <div className="flex justify-between items-center h-16 lg:hidden">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-slate-600 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative p-2 bg-gradient-to-br from-blue-600 to-slate-700 rounded-lg shadow-xl border border-slate-600/50">
                <Book className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold text-slate-100 group-hover:text-blue-200 transition-colors duration-300 tracking-tight">
              StudySync
            </span>
          </Link>

          {/* Mobile Right Section */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Mobile Navigation Dropdown */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl py-2 z-50"
                  >
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-slate-500/5 rounded-xl pointer-events-none"></div>

                    {/* Navigation Links */}
                    <Link
                      to="/admin/dashboard"
                      className="relative flex items-center px-4 py-3 text-sm text-slate-200 hover:text-white hover:bg-slate-700/30 transition-all duration-200 border-b border-slate-700/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/privacy"
                      className="relative flex items-center px-4 py-3 text-sm text-slate-200 hover:text-white hover:bg-slate-700/30 transition-all duration-200 border-b border-slate-700/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Privacy & Policy
                    </Link>
                    <Link
                      to="/about"
                      className="relative flex items-center px-4 py-3 text-sm text-slate-200 hover:text-white hover:bg-slate-700/30 transition-all duration-200 border-b border-slate-700/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Me
                    </Link>

                    {/* User Section in Mobile Menu */}
                    {authUser ? (
                      <div className="relative">
                        <button
                          onClick={() => setMobileUserDropdownOpen(!mobileUserDropdownOpen)}
                          className="relative flex items-center justify-between w-full px-4 py-3 text-sm text-slate-200 hover:text-white hover:bg-slate-700/30 transition-all duration-200 focus:outline-none"
                        >
                          <span className="font-medium">{authUser.name}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              mobileUserDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Mobile User Dropdown */}
                        <AnimatePresence>
                          {mobileUserDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/30"
                            >
                              <Link
                                to="/profile"
                                className="flex items-center gap-3 px-8 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/40 transition-all duration-200"
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setMobileUserDropdownOpen(false)
                                }}
                              >
                                <User size={14} />
                                My Profile
                              </Link>
                              <button
                                onClick={() => {
                                  logout()
                                  setMobileMenuOpen(false)
                                  setMobileUserDropdownOpen(false)
                                }}
                                className="flex w-full text-left items-center gap-3 px-8 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200"
                              >
                                <LogOut size={14} />
                                Sign Out
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to="/auth"
                        className="relative flex items-center px-4 py-3 text-sm text-slate-200 hover:text-white hover:bg-slate-700/30 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Avatar (Mobile) - Keep for visual consistency */}
            {authUser && (
              <img
                src={authUser.image || "/avatar.png"}
                alt="Profile"
                className="h-8 w-8 object-cover rounded-full border-2 border-slate-600/50 shadow-lg"
              />
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-slate-600 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-blue-600 to-slate-700 rounded-lg shadow-xl border border-slate-600/50">
                <Book className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-slate-100 group-hover:text-blue-200 transition-colors duration-300 tracking-tight">
              StudySync
            </span>
          </Link>

          {/* Right Section - Desktop */}
          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            <Link
              to="/admin/dashboard"
              className="text-slate-300 hover:text-white font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-slate-700/50 border border-transparent hover:border-slate-600/50"
            >
              Dashboard
            </Link>
            <Link
              to="/privacy"
              className="text-slate-300 hover:text-white font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-slate-700/50 border border-transparent hover:border-slate-600/50"
            >
              Privacy & Policy
            </Link>
            <Link
              to="/about"
              className="text-slate-300 hover:text-white font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-slate-700/50 border border-transparent hover:border-slate-600/50"
            >
              About Me
            </Link>

            {authUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 group focus:outline-none"
                >
                  <img
                    src={authUser.image || "/avatar.png"}
                    alt="Profile"
                    className="h-9 w-9 object-cover rounded-full border-2 border-slate-600/50 group-hover:border-blue-400/60 transition-all duration-200 shadow-lg"
                  />
                  <div className="hidden xl:block text-left">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-blue-200 transition-colors duration-200">
                      {authUser.name}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white/98 backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-2xl py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={authUser.image || "/avatar.png"}
                            alt="Profile"
                            className="h-10 w-10 object-cover rounded-full border border-slate-200"
                          />
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{authUser.name}</div>
                            <div className="text-xs text-slate-500">View profile</div>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <div className="h-px bg-slate-200 mx-2 my-1"></div>
                        <button
                          onClick={() => {
                            logout()
                            setDropdownOpen(false)
                          }}
                          className="flex w-full text-left items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth"
                  className="text-slate-300 hover:text-white font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-slate-700/50 border border-transparent hover:border-slate-600/50"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
