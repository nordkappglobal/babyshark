"use client";

import { useLeaderboard } from "@/hooks/useLeaderboard";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Medal, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Confetti from "@/components/client/Confetti";

type Props = {
  tvMode?: boolean;
};

export default function LeaderboardTable({ tvMode = false }: Props) {
  const { leaderboard, loading, error, refetch } = useLeaderboard(true);
  const prevTop1Ref = useRef<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (leaderboard.length > 0) {
      const top1 = leaderboard[0]?.result_id;
      if (prevTop1Ref.current !== null && top1 !== prevTop1Ref.current && tvMode) {
        // Top 1 changed! Trigger confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }
      prevTop1Ref.current = top1;
    }
  }, [leaderboard, tvMode]);

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
        <p className="text-blue-200 font-medium">Đang tải bảng xếp hạng...</p>
      </div>
    );
  }

  if (error && leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto", tvMode ? "scale-110" : "")}>
      {showConfetti && <Confetti />}
      <div className="flex flex-col gap-3">
        {/* Table Header */}
        <div className="grid grid-cols-[60px_1fr_100px_140px] md:grid-cols-[80px_1fr_120px_200px] gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-xs md:text-sm font-bold text-cyan-200 uppercase tracking-wider">
          <div className="text-center">Hạng</div>
          <div>Người chơi</div>
          <div className="text-center">Số lần</div>
          <div className="text-right pr-2">Danh hiệu</div>
        </div>

        {/* Table Body */}
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {leaderboard.map((entry, index) => {
              const isTop3 = entry.position <= 3;
              const medalColors = {
                1: "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]",
                2: "text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.8)]",
                3: "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]",
              };

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    delay: index * 0.1 
                  }}
                  key={entry.result_id}
                  className={cn(
                    "grid grid-cols-[60px_1fr_100px_140px] md:grid-cols-[80px_1fr_120px_200px] gap-2 px-4 py-4 md:py-5 mb-3 rounded-2xl items-center border",
                    entry.position === 1 ? "bg-gradient-to-r from-gold-500/20 to-yellow-400/10 border-gold-400/50 shadow-lg shadow-gold-500/20" :
                    entry.position === 2 ? "bg-white/10 border-gray-300/30" :
                    entry.position === 3 ? "bg-white/10 border-amber-600/30" :
                    "bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                  )}
                >
                  {/* Rank */}
                  <div className="flex justify-center items-center">
                    {isTop3 ? (
                      <div className="relative flex items-center justify-center">
                        <Medal className={cn("w-8 h-8 md:w-10 md:h-10", medalColors[entry.position as 1|2|3])} />
                        <span className="absolute text-[10px] md:text-xs font-black text-blue-900 mt-1">{entry.position}</span>
                      </div>
                    ) : (
                      <span className="text-xl md:text-2xl font-black text-blue-200/50">
                        #{entry.position}
                      </span>
                    )}
                  </div>

                  {/* Player Name */}
                  <div className="flex flex-col">
                    <span className={cn(
                      "font-bold md:text-lg truncate",
                      entry.position === 1 ? "text-gold-400 text-shadow-gold" : "text-white"
                    )}>
                      {entry.display_name}
                    </span>
                    <span className="text-[10px] md:text-xs text-blue-200/60 font-mono">
                      #{entry.player_code}
                    </span>
                  </div>

                  {/* Pullups */}
                  <div className="text-center flex justify-center">
                    <span className="inline-flex items-baseline gap-1">
                      <span className="text-2xl md:text-3xl font-black text-white text-shadow-glow">
                        {entry.pullups}
                      </span>
                    </span>
                  </div>

                  {/* Tier */}
                  <div className="text-right pr-2">
                    <span className={cn(
                      "text-xs md:text-sm font-bold truncate block",
                      entry.position === 1 ? "text-yellow-300" : "text-cyan-300"
                    )}>
                      {entry.tier_name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {leaderboard.length === 0 && !loading && (
            <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-blue-200">Chưa có ai ghi danh trên bảng vàng.</p>
              <Link href="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors">
                Trở thành người đầu tiên!
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
