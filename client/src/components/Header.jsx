"use client"

import { useEffect, useRef, useState } from "react"

import { useAuthStore } from "../store/useAuthStore"

import { Link } from "react-router-dom"

import { Book, User, LogOut } from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"

export const Header = () => {
  const { authUser, logout } = useAuthStore()

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")

  const [searchResults, setSearchResults] = useState([])

  const [searchLoading, setSearchLoading] = useState(false)

  const dropdownRef = useRef(null)

  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }

      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([])
      }
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false)

        setSearchResults([])

        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    document.addEventListener("keydown", handleEsc)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)

      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim() || !authUser) {
        setSearchResults([])

        setSearchLoading(false)

        return
      }

      setSearchLoading(true)

      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`, {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()

          setSearchResults(data)
        } else {
          setSearchResults([])
        }
      } catch (err) {
        console.error("Search error:", err)

        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }

    const delay = setTimeout(fetchUsers, 300)

    return () => clearTimeout(delay)
  }, [searchTerm, authUser])

  const handleSearchSelect = () => {
    setSearchTerm("")

    setSearchResults([])
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
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

          {/* Search Bar */}
          {authUser && (
            <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
              {/* you can insert search input here later */}

              {/* search dropdown */}

              <AnimatePresence>
                {(searchResults.length > 0 || searchLoading) && searchTerm.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto"
                  >
                    {searchLoading ? (
                      <div className="px-4 py-3 text-sm text-slate-600 text-center">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <Link
                          key={user._id}
                          to={`/profile/${user._id}`}
                          onClick={() => handleSearchSelect(user)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0"
                        >
                          <img
                            src={user.image || "/avatar.png"}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />

                          <div>
                            <div className="text-sm font-medium text-slate-900">{user.name}</div>

                            {user.age && <div className="text-xs text-slate-500">{user.age} years old</div>}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-600 text-center">No users found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Always show Dashboard */}

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

                  <div className="hidden sm:block text-left">
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
