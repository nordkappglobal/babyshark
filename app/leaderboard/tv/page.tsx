"use client";

import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { Bubbles } from "@/components/ui/Bubbles";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TVLeaderboardPage() {
  return (
    <main className="min-h-screen bg-water-gradient relative overflow-hidden flex flex-col justify-center items-center py-10 font-nunito">
      <Bubbles />
      
      {/* Background that looks good on TV */}
      <div className="absolute inset-0 bg-[url('/images/water-pattern.png')] opacity-20 animate-wave mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1600px] px-8 flex gap-12 items-center">
        
        {/* Left Side: Branding & Info */}
        <div className="w-[450px] shrink-0 flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="mb-6 flex gap-4"
          >
             {/* Replace with actual logos later */}
            <div className="w-32 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-xl">
              <span className="text-white font-bold text-sm">Hiepphatfood</span>
            </div>
            <div className="w-32 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-xl">
              <span className="text-white font-bold text-sm">Sunrise Pool</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="relative"
          >
            <h1 className="font-title text-6xl leading-none uppercase tracking-wide text-white text-3d-white mb-2">
              Thử Thách Cùng<br/>
              <span className="text-8xl text-sunrise-400 text-3d-sunrise leading-tight">Sunrise</span>
            </h1>
            
            <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/40 px-8 py-3 rounded-full shadow-[0_0_30px_rgba(255,153,0,0.4)] mb-8">
              <h2 className="font-title text-3xl uppercase tracking-widest text-gold-400">
                Leo Rank Xà Đơn
              </h2>
            </div>
          </motion.div>

          {/* Floating Mascot */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 relative mb-6 z-20 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
          >
            <Image
              src="/images/shark_mascot.png"
              alt="Mascot"
              fill
              className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
              sizes="(max-width: 768px) 192px, 192px"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="panel-glass p-6 rounded-3xl shadow-2xl flex flex-col items-center"
          >
            <div className="bg-white p-3 rounded-2xl shadow-inner mb-4 relative overflow-hidden group">
              {/* Actual QR code image */}
              <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
                <Image 
                  src="/images/qr.png" 
                  alt="Scan to join" 
                  fill
                  className="object-contain p-2"
                />
              </div>
              
              {/* Shine effect on QR */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-50"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />
            </div>
            <p className="text-2xl font-title text-white tracking-wide text-shadow-glow uppercase">
              Quét mã để tham gia ngay!
            </p>
          </motion.div>
        </div>

        {/* Right Side: Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="flex-1 transform scale-[1.10] origin-left"
        >
          <LeaderboardTable tvMode={true} />
        </motion.div>

      </div>
    </main>
  );
}
