"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Share2, Trophy, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getBasePath } from "@/lib/utils";
import Confetti from "@/components/client/Confetti";

export type ResultData = {
  playerCode: string;
  maskedName: string;
  pullups: number;
  rankAtSubmission: number;
  tierName: string;
  rewards: string[];
};

export default function ResultView({ data }: { data: ResultData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = `${window.location.origin}${getBasePath()}/result/${data.playerCode}`;
    const shareData = {
      title: 'Baby Shark Challenge',
      text: `Mình vừa đạt rank ${data.tierName} với ${data.pullups} lần kéo xà!`,
      url: url
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      // Fallback for browsers without Web Share API
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-water-gradient relative overflow-hidden">
      <Confetti />
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/water-pattern.png')] opacity-10 animate-wave mix-blend-overlay pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full max-w-md bg-glass rounded-3xl p-6 shadow-2xl relative z-10 border border-white/20 text-center"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-extrabold text-gold-400 text-shadow-gold mb-2 uppercase">
            🎉 Chúc Mừng! 🎉
          </h1>
          <p className="text-blue-100 font-medium">Người chơi thứ: #{data.playerCode}</p>
          <p className="text-white font-bold text-lg mt-1">{data.maskedName}</p>
        </motion.div>

        <motion.div 
          className="my-6 bg-white/10 rounded-2xl p-6 border-2 border-cyan-400/30"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <h2 className="text-sm font-bold text-cyan-200 uppercase tracking-wider mb-2">Thành tích đã ghi nhận</h2>
          <div className="text-5xl font-black text-white text-shadow-glow flex items-center justify-center gap-3">
            🦈 {data.pullups} <span className="text-2xl mt-3">LẦN</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="bg-blue-900/50 rounded-xl p-4 border border-blue-400/20"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs font-bold text-blue-200 uppercase mb-1">Xếp hạng</p>
            <p className="text-2xl font-black text-gold-400">🏅 #{data.rankAtSubmission}</p>
          </motion.div>
          
          <motion.div 
            className="bg-blue-900/50 rounded-xl p-4 border border-blue-400/20"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <p className="text-xs font-bold text-blue-200 uppercase mb-1">Danh hiệu</p>
            <p className="text-xl font-bold text-cyan-300 leading-tight">🦈 {data.tierName}</p>
          </motion.div>
        </div>

        {data.rewards.length > 0 && (
          <motion.div 
            className="text-left bg-white/5 rounded-xl p-4 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-3 text-center">
              Mốc quà tặng của bạn
            </p>
            <ul className="space-y-2">
              {data.rewards.map((reward, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-start gap-2 text-sm text-blue-50 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + (i * 0.1) }}
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span>{reward}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div 
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 flex gap-3 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0" />
          <p className="text-xs text-yellow-100 font-medium leading-relaxed">
            <strong className="text-yellow-400">Lưu ý:</strong> Vui lòng đưa màn hình này cho giám sát viên Sunrise. Phần quà được trao khi số lần kéo xà thực tế, đúng kỹ thuật và khớp với thành tích đã nhập.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <button 
            onClick={handleShare}
            className="w-full py-4 rounded-xl bg-[#1877F2] text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#166fe5] transition-colors"
          >
            <Share2 className="w-5 h-5" />
            CHIA SẺ THÀNH TÍCH
          </button>
          
          <div className="flex gap-3">
            <Link 
              href="/leaderboard"
              className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/10"
            >
              <Trophy className="w-5 h-5 text-gold-400" />
              BXH
            </Link>
            
            <Link 
              href="/"
              className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/10"
            >
              <RotateCcw className="w-5 h-5" />
              CHƠI LẠI
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
