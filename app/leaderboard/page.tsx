import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng Xếp Hạng | Baby Shark Challenge",
  description: "Bảng xếp hạng những người kéo xà xuất sắc nhất tại Sunrise Pool.",
};

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-water-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/water-pattern.png')] opacity-10 animate-wave mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-200 hover:text-white transition-colors mb-6 font-medium">
          <ArrowLeft className="w-5 h-5" />
          Về trang chủ
        </Link>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-4 shadow-xl border border-white/20">
            <Trophy className="w-12 h-12 text-gold-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white text-shadow-glow uppercase tracking-wider mb-2">
            Bảng Xếp Hạng
          </h1>
          <p className="text-cyan-200 font-bold tracking-widest uppercase">
            Baby Shark Challenge
          </p>
        </div>

        <LeaderboardTable />
      </div>
    </main>
  );
}
