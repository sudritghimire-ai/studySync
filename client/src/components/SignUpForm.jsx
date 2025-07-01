"use client"

import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { Eye, EyeOff, User, Mail, Lock, Calendar, Users, Heart, ArrowRight } from "lucide-react"

const SignUpForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [genderPreference, setGenderPreference] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { signup, loading } = useAuthStore()

  return (
    <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 shadow-xl overflow-y-auto max-h-[80vh]">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          signup({ name, email, password, gender, age, genderPreference })
        }}
      >
        {/* NAME */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
              placeholder="Your full name"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
              placeholder="your.email@domain.com"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-cyan-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* AGE */}
        <div>
          <label htmlFor="age" className="block text-sm font-semibold text-white mb-2">
            Age
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              id="age"
              type="number"
              min="18"
              max="120"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
              placeholder="Your age"
            />
          </div>
        </div>

        {/* GENDER */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-1">
            <Users className="w-4 h-4" /> Your Gender
          </label>
          <div className="grid grid-cols-2 gap-3">
            {["male", "female"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGender(option)}
                className={`p-3 rounded-xl border transition font-medium ${
                  gender === option
                    ? option === "male"
                      ? "border-cyan-400 bg-cyan-500/20 text-white"
                      : "border-pink-400 bg-pink-500/20 text-white"
                    : "border-white/30 bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {option === "male" ? "👨 Male" : "👩 Female"}
              </button>
            ))}
          </div>
        </div>

        {/* STUDY PARTNER PREFERENCE */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-1">
            <Heart className="w-4 h-4" /> Study Partner Preference
          </label>
          <div className="space-y-3">
            {[
              { value: "male", label: "👨‍🎓 Male Partners", color: "cyan" },
              { value: "female", label: "👩‍🎓 Female Partners", color: "pink" },
              { value: "both", label: "👥 Both", color: "purple" },
            ].map(({ value, label, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => setGenderPreference(value)}
                className={`w-full p-3 rounded-xl border transition font-medium flex items-center gap-2 ${
                  genderPreference === value
                    ? `border-${color}-400 bg-${color}-500/20 text-white`
                    : "border-white/30 bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-lg shadow transition ${
              loading
                ? "bg-white/20 text-white/50 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-pink-500 text-white hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? "Creating Account..." : "Complete Sign Up! 🚀"}
          </button>
        </div>

        {/* TERMS */}
        <div className="text-center text-xs text-white/60 mt-2">
          By signing up, you agree to our{" "}
          <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>.
        </div>
      </form>
    </div>
  )
}

export default SignUpForm
