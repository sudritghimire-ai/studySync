"use client"

import { useEffect, useState } from "react"

import Sidebar from "../components/Sidebar"

import { useMatchStore } from "../store/useMatchStore"

import { Heart } from "lucide-react"

import SwipeArea from "../components/SwipeArea"

import SwipeFeedback from "../components/SwipeFeedback"

import { useAuthStore } from "../store/useAuthStore"

import { toast } from "react-toastify"
import { GraduationCap } from "lucide-react";

import "react-toastify/dist/ReactToastify.css"

import "./animation.css"

const HomePage = () => {
  const { authUser } = useAuthStore()

  const [hasUnread, setHasUnread] = useState(false)

  const [notifiedOnce, setNotifiedOnce] = useState(false)

  const {
    isLoadingUserProfiles,

    getUserProfiles,

    userProfiles,

    subscribeToNewMatches,

    unsubscribeFromNewMatches,
  } = useMatchStore()

  useEffect(() => {
    const checkNewMessages = async () => {
      try {
        const res = await fetch("/api/messages/unread-senders", {
          headers: {
            Authorization: `Bearer ${authUser?.token}`,
          },
        })

        if (!res.ok) throw new Error(`status ${res.status}`)

        const data = await res.json()

        if (data.senders.length > 0) {
          setHasUnread(true)

          if (!notifiedOnce) {
            toast.info("📨 You have new messages!", {
              position: "top-center",

              autoClose: 5000,

              theme: "dark",
            })

            setNotifiedOnce(true)
          }
        } else {
          setHasUnread(false)
        }
      } catch (err) {
        console.error("Unread check failed", err)

        setHasUnread(false)
      }
    }

    checkNewMessages()

    const interval = setInterval(checkNewMessages, 5000)

    return () => clearInterval(interval)
  }, [authUser, notifiedOnce])

  useEffect(() => {
    getUserProfiles()
  }, [getUserProfiles])

  useEffect(() => {
    if (authUser) subscribeToNewMatches()

    return () => unsubscribeFromNewMatches()
  }, [authUser, subscribeToNewMatches, unsubscribeFromNewMatches])

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden relative">
      {/* Epic Background Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Smoke/Fog Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30"></div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-1/4 left-1/6 w-32 h-32 border-2 border-red-500/20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-blue-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-2/3 left-1/3 w-16 h-16 bg-purple-600/10 rotate-12 animate-pulse delay-1000"></div>

        {/* Tattoo-like Tribal Patterns */}
        <div className="absolute top-1/2 left-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full text-white">
            <path d="M100,20 Q150,50 180,100 Q150,150 100,180 Q50,150 20,100 Q50,50 100,20 Z" fill="currentColor" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M70,70 L130,130 M130,70 L70,130" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-5 rotate-180">
          <svg viewBox="0 0 200 200" className="w-full h-full text-white">
            <path
              d="M100,10 L120,60 L170,60 L130,90 L150,140 L100,110 L50,140 L70,90 L30,60 L80,60 Z"
              fill="currentColor"
            />
            <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>

        {/* Grunge Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)
            `,
            backgroundSize: "80px 80px, 120px 120px, 200px 200px",
          }}
        ></div>

        {/* Neon Glow Effects */}
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-500/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-3/4 right-1/6 w-64 h-64 bg-purple-500/6 rounded-full blur-2xl animate-pulse delay-1000"></div>

        {/* Street Art Style Lines */}
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent"></div>
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/15 to-transparent"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1/2 bg-gradient-to-t from-purple-500/20 to-transparent"></div>

        {/* Abstract Shapes */}
        <div className="absolute top-1/6 right-1/5 w-20 h-20 border-l-4 border-t-4 border-yellow-400/20 rotate-45"></div>
        <div className="absolute bottom-1/5 left-1/8 w-16 h-16 border-r-4 border-b-4 border-green-400/20 -rotate-12"></div>

        {/* Distressed/Worn Effect */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.1) 2px,
                rgba(255,255,255,0.1) 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 3px,
                rgba(255,255,255,0.05) 3px,
                rgba(255,255,255,0.05) 6px
              )
            `,
          }}
        ></div>

        {/* Ink Splatter Effects */}
        <div className="absolute top-1/5 left-2/3 w-8 h-8 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/5 left-2/3 w-4 h-4 bg-white/8 rounded-full translate-x-6 translate-y-2"></div>
        <div className="absolute top-1/5 left-2/3 w-2 h-2 bg-white/10 rounded-full translate-x-10 translate-y-6"></div>

        <div className="absolute bottom-2/5 right-1/5 w-6 h-6 bg-red-500/10 rounded-full"></div>
        <div className="absolute bottom-2/5 right-1/5 w-3 h-3 bg-red-500/15 rounded-full -translate-x-4 translate-y-3"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-900/40 to-transparent pointer-events-none"></div>

      {/* Film Grain Effect */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
            radial-gradient(circle at 3px 7px, rgba(255,255,255,0.1) 1px, transparent 0),
            radial-gradient(circle at 7px 3px, rgba(255,255,255,0.08) 1px, transparent 0)
          `,
          backgroundSize: "20px 20px, 30px 30px, 25px 25px",
        }}
      ></div>

      <Sidebar />

      <div className="flex-grow flex flex-col relative z-10 overflow-hidden">
        <main className="flex-grow flex flex-col gap-10 justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-violet-600/20 to-indigo-600/20 rounded-3xl blur-xl scale-110 opacity-50"></div>

            {userProfiles.length > 0 && !isLoadingUserProfiles && (
             <div className="relative w-full space-y-8">
  <div className="relative">
    <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-violet-500/10 rounded-3xl blur-lg"></div>
    <SwipeArea />
    <SwipeFeedback />
  </div>
</div>

            )}

            {userProfiles.length === 0 && !isLoadingUserProfiles && <NoMoreProfiles />}

            {isLoadingUserProfiles && <LoadingUI />}
          </div>

          {/* floating button with red dot */}

          <div className="fixed bottom-6 right-6 z-50">
            <div className="relative">
              <button
                onClick={() => {
                  const sidebarBtn = document.querySelector("[data-sidebar-toggle]")

                  sidebarBtn?.click()

                  setHasUnread(false) // clear the red dot

                  setNotifiedOnce(false) // allow future notifications
                }}
                className="p-4 bg-purple-600 rounded-full text-white shadow-lg"
              >
                💬
              </button>

              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage

const NoMoreProfiles = () => (
  <div className="relative flex flex-col items-center justify-center h-full text-center p-8 max-w-md mx-auto animate-fade-in">
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl blur-2xl"></div>

    <div className="relative z-10 space-y-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-full blur-xl scale-150 animate-pulse"></div>

      <div
  className="relative mx-auto w-48 h-48 flex flex-col items-center justify-center rounded-full border border-amber-400 bg-gradient-to-br from-amber-400/20 to-orange-500/20 shadow-xl backdrop-blur-md space-y-3"
>
  <GraduationCap className="text-amber-400 animate-bounce" size={48} />
  <h1 className="text-lg font-semibold text-amber-600">SpringFallUSA</h1>
</div>


      </div>

  <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent mb-4 animate-gradient">
  Whoa, quick searcher!
</h2>

<p className="text-xl text-purple-200 mb-8 leading-relaxed font-light">
  You’ve checked out all available study partners for now. Take a short break and come back later to find new buddies! 📚✨
</p>


    </div>
  </div>
)

const LoadingUI = () => (
  <div className="flex justify-center items-center h-full p-10">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400"></div>
  </div>
)
