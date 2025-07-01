"use client"

const AboutMe = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-cyan-300 p-6 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Scanning lines animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-vertical opacity-60"></div>
        <div className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scan-horizontal opacity-40"></div>
      </div>

      {/* Futuristic ID card */}
      <div className="relative bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border-2 border-cyan-500/60 rounded-2xl p-8 shadow-2xl w-full max-w-md text-center backdrop-blur-md hover:border-cyan-400/80 transition-all duration-500 group">
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scanline pointer-events-none rounded-2xl"></div>

        {/* Header section */}
        <div className="relative mb-6">
          <div className="text-xs text-cyan-500 font-mono tracking-widest mb-2 opacity-70">
            [ IDENTITY_PROFILE.EXE ]
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-4"></div>
        </div>

        {/* Profile image with futuristic frame */}
        <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-md animate-pulse"></div>
          <div className="relative border-2 border-cyan-400/60 rounded-xl overflow-hidden">
            <img
              src="https://i.ibb.co/TDB3zCNj/gravity.png"
              alt="Gravity avatar"
              className="w-full h-auto rounded-lg"
            />
            {/* Image scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-image-scan"></div>
          </div>

          {/* Data points around image */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
        </div>

        {/* Name with code-like font */}
        <div className="mb-4">
          <h1 className="text-4xl font-mono font-bold text-cyan-400 tracking-[0.3em] mb-2 group-hover:text-cyan-300 transition-colors duration-300">
            GRAVITY
          </h1>
          <div className="text-xs text-cyan-500 font-mono opacity-60">
            {"<"} DEVELOPER_ID: 0x7F3A9B {"/>"}
          </div>
        </div>

        {/* Bio section */}
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-4"></div>

       <p className="text-sm text-cyan-200 leading-relaxed font-light">
  I am Gravity, a web developer focused on building tools that work, help people, and make a difference — no excuses.
</p>


          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-4 mb-4"></div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center space-x-2 text-xs font-mono">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-cyan-500 animate-pulse">Be the reason they rise with a smile — </span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Data stream effect */}
        <div className="absolute bottom-4 right-4 text-xs font-mono text-cyan-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          01001000 01101001
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-float-1"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-float-2"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-cyan-500 rounded-full animate-float-3"></div>
      </div>

      <style jsx>{`
        @keyframes scan-vertical {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        
        @keyframes scan-horizontal {
          0% { left: -2px; }
          100% { left: 100%; }
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes image-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(15px) translateX(-15px); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(-20px); }
        }
        
        .animate-scan-vertical {
          animation: scan-vertical 3s linear infinite;
        }
        
        .animate-scan-horizontal {
          animation: scan-horizontal 4s linear infinite;
        }
        
        .animate-scanline {
          animation: scanline 2s linear infinite;
        }
        
        .animate-image-scan {
          animation: image-scan 3s ease-in-out infinite;
        }
        
        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default AboutMe
