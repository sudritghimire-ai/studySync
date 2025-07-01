"use client"

import { useRef, useState, useEffect } from "react"
import { Header } from "../components/Header"
import { useAuthStore } from "../store/useAuthStore"
import { useUserStore } from "../store/useUserStore"
import {
  Camera,
  Upload,
  User,
  Heart,
  Calendar,
  GraduationCap,
  BookOpen,
  AlertCircle,
  Trash2,
  Shield,
} from "lucide-react"

const ProfilePage = () => {
  // Safe fallback for authUser
  const { authUser, logout } = useAuthStore()
  const safeAuthUser = authUser || {}

  const [name, setName] = useState(safeAuthUser.name || "")
  const [bio, setBio] = useState(safeAuthUser.bio || "")
  const [age, setAge] = useState(safeAuthUser.age || "")
  const [gender, setGender] = useState(safeAuthUser.gender || "")
  const [genderPreference, setGenderPreference] = useState(safeAuthUser.genderPreference || "")
  const [image, setImage] = useState(safeAuthUser.image || null)
  const [subtitleText, setSubtitleText] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Delete account states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const fileInputRef = useRef(null)
  const { loading, updateProfile } = useUserStore()

  const fullSubtitle = "Build your student profile to connect with study partners"

  // Ensure component is loaded and visible
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Typewriter effect for subtitle
  useEffect(() => {
    if (!isLoaded) return

    let index = 0
    const timer = setInterval(() => {
      if (index < fullSubtitle.length) {
        setSubtitleText(fullSubtitle.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [isLoaded])

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      updateProfile({ name, bio, age, gender, genderPreference, image })
    } catch (error) {
      console.error("Profile update error:", error)
      setHasError(true)
    }
  }

  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImage(reader.result)
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error("Image upload error:", error)
      setHasError(true)
    }
  }

  // Delete account functionality
  const handleDeleteAccount = async () => {
    if (!authUser?._id) {
      setDeleteError("User not authenticated")
      return
    }

    setDeleteLoading(true)
    setDeleteError("")

    try {
const response = await fetch(`/api/users/me`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account")
      }

      // Clear local auth state
      logout()

      // Clear any localStorage/sessionStorage if you use it
      localStorage.clear()
      sessionStorage.clear()

      // Redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Delete account error:", error)
      setDeleteError(error.message || "Failed to delete account. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  // Error fallback component
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col">
        <div className="bg-slate-800/90 backdrop-blur-xl border-b border-slate-700/50">
          <Header />
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 max-w-md w-full text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-slate-300 mb-4">We're having trouble loading your profile. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes typewriter-cursor {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0, #cbd5e1);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 4s ease infinite;
        }
        .glassmorphism {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
        }
        .glassmorphism-card {
          background: rgba(30, 41, 59, 0.85);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(147, 51, 234, 0.3);
          min-height: 600px;
        }
        .floating-shape {
          animation: float-gentle 8s ease-in-out infinite;
        }
        .premium-button {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 4px 14px rgba(139, 92, 246, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .premium-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #7c3aed, #6d28d9, #5b21b6);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 6px 20px rgba(139, 92, 246, 0.4);
          transform: translateY(-2px);
        }
        .danger-button {
          background: linear-gradient(135deg, #dc2626, #b91c1c, #991b1b);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 4px 14px rgba(220, 38, 38, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .danger-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #b91c1c, #991b1b, #7f1d1d);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 6px 20px rgba(220, 38, 38, 0.4);
          transform: translateY(-2px);
        }
        .pill-radio {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 48px;
        }
        .pill-radio.selected {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          box-shadow: 0 4px 14px rgba(139, 92, 246, 0.3);
        }
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1), 0 4px 14px rgba(147, 51, 234, 0.15);
        }
        .typewriter-cursor::after {
          content: '|';
          animation: typewriter-cursor 1s infinite;
          color: #a855f7;
        }
        .fade-in-up {
          opacity: 1;
          animation: fade-in-up 0.8s ease-out;
        }
        .scale-in {
          opacity: 1;
          animation: scale-in 0.6s ease-out;
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
        .stagger-7 { animation-delay: 0.7s; }
        .stagger-8 { animation-delay: 0.8s; }
        .form-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .form-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem 1rem;
        }
        @media (max-height: 800px) {
          .form-content {
            justify-content: flex-start;
            padding: 1rem;
          }
        }
      `}</style>

      <div className="form-container bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
        {/* Floating Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 border border-purple-500/20 rounded-full floating-shape opacity-30"></div>
          <div
            className="absolute bottom-32 left-16 w-24 h-24 border border-blue-500/20 rounded-full floating-shape opacity-25"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-16 h-16 border border-violet-500/20 rounded-full floating-shape opacity-20"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute top-1/3 left-1/6 w-12 h-12 bg-purple-500/10 rounded-full floating-shape blur-sm"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/6 w-8 h-8 bg-blue-500/10 rounded-full floating-shape blur-sm"
            style={{ animationDelay: "3s" }}
          ></div>
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header with glassmorphism */}
        <div className="glassmorphism border-b border-slate-700/50 relative z-10">
          <Header />
        </div>

        {/* Main Content */}
        <div className="form-content relative z-10">
          {/* Title Section */}
          <div className="text-center mb-8 max-w-4xl mx-auto px-4">
            <div className={`${isLoaded ? "fade-in-up stagger-1" : "opacity-100"}`}>
              <div className="inline-flex items-center gap-4 mb-6 flex-wrap justify-center">
                <div
                  className="p-4 glassmorphism rounded-2xl shadow-2xl"
                  style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
                >
                  <GraduationCap className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold shimmer-text leading-tight text-center sm:text-left">
                  Academic Profile
                </h1>
              </div>
            </div>
            <div className={`${isLoaded ? "fade-in-up stagger-2" : "opacity-100"}`}>
              <p className="text-base sm:text-lg text-slate-300 font-medium typewriter-cursor">
                {subtitleText || fullSubtitle}
              </p>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="max-w-2xl mx-auto w-full px-4">
            <div
              className={`glassmorphism-card rounded-3xl shadow-2xl p-6 sm:p-8 ${isLoaded ? "fade-in-up stagger-3" : "opacity-100"}`}
              style={{
                animation: isLoaded ? "glow-pulse 4s ease-in-out infinite" : "none",
                border: "2px solid rgba(147, 51, 234, 0.3)",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Section */}
                <div
                  className={`flex flex-col items-center space-y-6 ${isLoaded ? "scale-in stagger-4" : "opacity-100"}`}
                >
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 shadow-2xl border-4 border-purple-500/30">
                      {image ? (
                        <img src={image || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-3 glassmorphism rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group border border-purple-500/30"
                      style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
                    >
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Name and Age Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className={`${isLoaded ? "fade-in-up stagger-5" : "opacity-100"}`}>
                    <label className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-200 mb-3">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 sm:py-4 glassmorphism rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none input-glow transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className={`${isLoaded ? "fade-in-up stagger-5" : "opacity-100"}`}>
                    <label className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-200 mb-3">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      Age
                    </label>
                    <input
                      type="number"
                      required
                      min="16"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 sm:py-4 glassmorphism rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none input-glow transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>

                {/* Gender Selection */}
                <div className={`${isLoaded ? "fade-in-up stagger-6" : "opacity-100"}`}>
                  <label className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-200 mb-4">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Gender Identity
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {["Male", "Female"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setGender(option.toLowerCase())}
                        className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border transition-all duration-300 pill-radio ${
                          gender === option.toLowerCase()
                            ? "selected text-white border-purple-500/50"
                            : "glassmorphism text-slate-300 border-slate-600/50 hover:border-purple-500/30"
                        }`}
                      >
                        <span className="font-medium text-sm sm:text-base">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Study Partner Preference */}
                <div className={`${isLoaded ? "fade-in-up stagger-6" : "opacity-100"}`}>
                  <label className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-200 mb-4">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Looking for Study Partner
                  </label>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    {["Male", "Female", "Both"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setGenderPreference(option.toLowerCase())}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 rounded-xl border transition-all duration-300 pill-radio ${
                          genderPreference.toLowerCase() === option.toLowerCase()
                            ? "selected text-white border-purple-500/50"
                            : "glassmorphism text-slate-300 border-slate-600/50 hover:border-purple-500/30"
                        }`}
                      >
                        <span className="font-medium text-sm sm:text-base">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio Section */}
                <div className={`${isLoaded ? "fade-in-up stagger-7" : "opacity-100"}`}>
                  <label className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-200 mb-3">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Academic Bio
                  </label>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 sm:py-4 glassmorphism rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none input-glow transition-all duration-300 resize-none text-sm sm:text-base leading-relaxed"
                    placeholder="Share your academic interests, study goals, and what you're looking for in a study partner..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs sm:text-sm text-slate-500">Be authentic and professional</p>
                    <p className="text-xs sm:text-sm text-slate-400">{bio.length}/500</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className={`${isLoaded ? "fade-in-up stagger-7" : "opacity-100"}`}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full premium-button text-white font-semibold py-3 sm:py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm sm:text-base min-h-[48px]"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                        Save Academic Profile
                      </>
                    )}
                  </button>
                </div>

                {/* Delete Account Section - Only show for authenticated users */}
                {authUser && (
                  <div className={`${isLoaded ? "fade-in-up stagger-8" : "opacity-100"}`}>
                    <div className="pt-6 border-t border-slate-700/50">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-red-400" />
                        <h3 className="text-lg font-semibold text-slate-200">Danger Zone</h3>
                      </div>

                      {!showDeleteConfirm ? (
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-3 px-6 py-3 bg-slate-800/50 hover:bg-red-900/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete My Account
                        </button>
                      ) : (
                        <div className="space-y-4 p-4 bg-red-900/10 border border-red-500/30 rounded-xl">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-red-400 font-semibold mb-2">Are you absolutely sure?</h4>
                              <p className="text-sm text-slate-300 mb-4">
                                This action cannot be undone. This will permanently delete your account, remove all your
                                data, and you will lose access to all matches and conversations.
                              </p>
                              {deleteError && (
                                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                                  <p className="text-red-400 text-sm">{deleteError}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setShowDeleteConfirm(false)
                                setDeleteError("")
                              }}
                              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleDeleteAccount}
                              disabled={deleteLoading}
                              className="flex-1 danger-button text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                              {deleteLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4" />
                                  Yes, Delete Forever
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
