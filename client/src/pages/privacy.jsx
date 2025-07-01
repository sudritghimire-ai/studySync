"use client"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Shield, ArrowLeft, Mail, Lock, Eye, Users } from "lucide-react"

export default function Privacy() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
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
        .fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .fade-in {
          opacity: 0;
          animation: fade-in 0.6s ease-out forwards;
        }
        .slide-in-left {
          opacity: 0;
          animation: slide-in-left 0.7s ease-out forwards;
        }
        .float-icon {
          animation: float-gentle 3s ease-in-out infinite;
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
        .stagger-7 { animation-delay: 0.7s; }
        .hero-gradient {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        .card-shadow {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(0, 0, 0, 0.05);
        }
        .button-shadow {
          box-shadow: 
            0 4px 14px 0 rgba(59, 130, 246, 0.25),
            0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        .button-shadow:hover {
          box-shadow: 
            0 6px 20px 0 rgba(59, 130, 246, 0.35),
            0 2px 6px 0 rgba(0, 0, 0, 0.15);
        }
        .section-icon {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }
        .list-item-hover {
          transition: all 0.2s ease;
        }
        .list-item-hover:hover {
          transform: translateX(4px);
          color: #1e40af;
        }
        .email-link {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          transition: all 0.3s ease;
        }
        .email-link:hover {
          background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="min-h-screen hero-gradient">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-12">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-100 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-slate-100 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className={`${isLoaded ? "fade-in-up stagger-1" : "opacity-0"}`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 float-icon">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-4 leading-tight">
                Privacy Policy
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Your privacy and data security are our top priorities at StudySync
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div
            className={`bg-white rounded-3xl card-shadow p-8 sm:p-12 ${isLoaded ? "fade-in stagger-2" : "opacity-0"}`}
          >
            {/* Introduction */}
            <div className={`mb-12 ${isLoaded ? "slide-in-left stagger-3" : "opacity-0"}`}>
              <p className="text-lg text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
                At StudySync, protecting your privacy is a priority. This Privacy Policy explains how we collect, use,
                and protect your personal data when you use our student funding platform.
              </p>
            </div>

            {/* Information We Collect */}
            <section className={`mb-12 ${isLoaded ? "slide-in-left stagger-4" : "opacity-0"}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="section-icon p-3 rounded-xl">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Information We Collect</h2>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
                <ul className="space-y-4 list-disc list-inside marker:text-blue-500">
                  <li className="list-item-hover">
                    <span className="text-slate-700 leading-relaxed">
                      Basic personal information (such as name, email, age) when you create an account.
                    </span>
                  </li>
                  <li className="list-item-hover">
                    <span className="text-slate-700 leading-relaxed">
                      Academic details and funding preferences you choose to share.
                    </span>
                  </li>
                  <li className="list-item-hover">
                    <span className="text-slate-700 leading-relaxed">
                      Usage data, such as pages visited and actions on the platform.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className={`mb-12 ${isLoaded ? "slide-in-left stagger-5" : "opacity-0"}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="section-icon p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">How We Use Your Information</h2>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
                <ul className="space-y-4 list-disc list-inside marker:text-blue-500">
                  <li className="list-item-hover">
                    <span className="text-slate-700 leading-relaxed">
                      To match you with relevant funding opportunities and scholarships.
                    </span>
                  </li>
                  <li className="list-item-hover">
                    <span className="text-slate-700 leading-relaxed">
                      To improve our platform and deliver a better user experience.
                    </span>
                  </li>
                  <li className="list-item-hover">
                    <span className="text-slate-700 leading-relaxed">
                      To communicate important updates or support information.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className={`mb-12 ${isLoaded ? "slide-in-left stagger-6" : "opacity-0"}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="section-icon p-3 rounded-xl">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Data Security</h2>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
                <p className="text-slate-700 leading-relaxed text-lg">
                  We implement reasonable security measures to protect your personal data from unauthorized access,
                  alteration, or disclosure. Your trust is important to us, and we continuously work to maintain the
                  highest standards of data protection.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className={`mb-12 ${isLoaded ? "slide-in-left stagger-7" : "opacity-0"}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="section-icon p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Your Rights</h2>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
                <p className="text-slate-700 leading-relaxed text-lg mb-4">
                  You have the right to request access, correction, or deletion of your personal data at any time.
                  Please contact us at:
                </p>
                <div className="inline-flex items-center gap-3 email-link px-4 py-3 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">support@springfallusa.com</span>
                </div>
              </div>
            </section>

            {/* Acceptance of Policy */}
            <section className={`mb-12 ${isLoaded ? "slide-in-left stagger-7" : "opacity-0"}`}>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Acceptance of Policy</h2>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100">
                <p className="text-slate-700 leading-relaxed text-lg">
                  By creating an account or using this website, you acknowledge and agree to this Privacy Policy and our
                  Terms of Service. If you do not agree, please discontinue use of the platform.
                </p>
              </div>
            </section>

            {/* Return Button */}
            <div className={`text-center ${isLoaded ? "fade-in-up stagger-7" : "opacity-0"}`}>
              <Link
                to="/"
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full button-shadow transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <ArrowLeft className="w-5 h-5" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
