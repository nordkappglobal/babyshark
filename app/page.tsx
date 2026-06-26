"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { submitResultSchema, SubmitResultInput } from "@/lib/validations";
import { Loader2, Plus, Minus, Trophy, Droplets } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Bubbles } from "@/components/ui/Bubbles";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubmitResultInput>({
    resolver: zodResolver(submitResultSchema),
    defaultValues: {
      fullName: "",
      pullups: 0,
      captchaCode: "",
      idempotencyKey: "",
    },
  });

  const pullups = watch("pullups");

  const onSubmit = async (data: SubmitResultInput) => {
    setIsSubmitting(true);
    setErrorMsg("");

    if (!data.idempotencyKey) {
      data.idempotencyKey = uuidv4();
    }

    try {
      const res = await fetch("/api/submit-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMsg(result.error || "Có lỗi xảy ra. Vui lòng thử lại.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/result/${result.result.playerCode}`);
    } catch (error) {
      setErrorMsg("Lỗi kết nối. Vui lòng kiểm tra mạng.");
      setIsSubmitting(false);
    }
  };

  const adjustPullups = (amount: number) => {
    const current = Number(pullups) || 0;
    const next = Math.max(0, Math.min(999, current + amount));
    setValue("pullups", next, { shouldValidate: true });
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 bg-water-gradient relative overflow-hidden">
      <Bubbles />

      {/* Header Sponsors Mock */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex justify-between items-center z-10 pt-4 pb-8"
      >
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-ocean-200 mb-1">Đơn vị tài trợ</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full bg-green-500" />
            </div>
            <span className="font-title font-bold text-white leading-tight">Hiepphat Food<br/><span className="text-[10px] text-ocean-200">Catering Service</span></span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-orange-400 border-2 border-white" />
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-md flex flex-col items-center z-10"
      >
        {/* Title Area */}
        <motion.div variants={itemVariants} className="text-center w-full relative mb-4">
          <h1 className="font-title text-4xl leading-none uppercase tracking-wide text-white text-3d-white">
            Thử Thách Cùng
          </h1>
          <div className="relative inline-block mt-[-5px]">
            <h2 className="font-title text-6xl uppercase tracking-wider text-sunrise-400 text-3d-sunrise">
              Sunrise
            </h2>
            <Droplets className="absolute -top-2 -right-6 w-8 h-8 text-cyan-400 rotate-12" />
          </div>
          <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm border border-white/40 px-6 py-2 rounded-full shadow-lg">
            <h3 className="font-title text-2xl uppercase tracking-widest text-gold-400">
              Leo Rank Xà Đơn
            </h3>
          </div>
        </motion.div>

        {/* 3D Mascot Image */}
        <motion.div 
          variants={itemVariants}
          className="w-56 h-56 relative mb-6 z-20 pointer-events-none rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-white/5"
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* We use mix-blend-multiply to remove the white background of the AI generated image if needed, or drop-shadow. */}
          <div className="absolute inset-0 bg-ocean-400/30 rounded-full blur-2xl -z-10 animate-pulse" />
          <Image
            src="/images/shark_mascot.png"
            alt="Mascot"
            fill
            className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
            sizes="(max-width: 768px) 224px, 224px"
            priority
          />
        </motion.div>

        {/* Form Container */}
        <motion.div variants={itemVariants} className="w-full panel-glass rounded-3xl p-6 pt-12 shadow-2xl relative">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-ocean-200 uppercase tracking-wider ml-1">
                Họ và tên
              </label>
              <input
                {...register("fullName")}
                type="text"
                placeholder="Nhập họ tên của bạn"
                className="w-full px-5 py-4 rounded-xl input-sea text-ocean-900 text-lg font-bold transition-all"
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm font-bold ml-1 drop-shadow-md">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-ocean-200 uppercase tracking-wider ml-1">
                Số lần kéo xà
              </label>
              <div className="flex items-center justify-between input-sea rounded-xl overflow-hidden transition-all h-20">
                <button
                  type="button"
                  onClick={() => adjustPullups(-1)}
                  className="w-20 h-full flex items-center justify-center text-ocean-600 hover:bg-ocean-200/50 active:bg-ocean-200 transition-colors"
                >
                  <Minus className="w-8 h-8 stroke-[3]" />
                </button>
                
                <input
                  {...register("pullups", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="999"
                  className="w-full h-full text-center bg-transparent text-ocean-900 text-5xl font-title font-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setValue("pullups", isNaN(val) ? 0 : val, { shouldValidate: true });
                  }}
                />
                
                <button
                  type="button"
                  onClick={() => adjustPullups(1)}
                  className="w-20 h-full flex items-center justify-center text-ocean-600 hover:bg-ocean-200/50 active:bg-ocean-200 transition-colors"
                >
                  <Plus className="w-8 h-8 stroke-[3]" />
                </button>
              </div>
              {errors.pullups && (
                <p className="text-red-400 text-sm font-bold ml-1 drop-shadow-md">{errors.pullups.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-ocean-200 uppercase tracking-wider ml-1">
                Mã xác nhận (Từ nhân viên)
              </label>
              <input
                {...register("captchaCode")}
                type="text"
                placeholder="Nhập mã xác nhận"
                className="w-full px-5 py-4 rounded-xl input-sea text-ocean-900 text-lg font-bold text-center uppercase tracking-widest transition-all"
              />
              {errors.captchaCode && (
                <p className="text-red-400 text-sm font-bold ml-1 drop-shadow-md">{errors.captchaCode.message}</p>
              )}
            </div>

            {errorMsg && (
              <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="p-3 bg-red-500/90 border-2 border-red-400 rounded-xl text-white text-sm font-bold text-center shadow-lg">
                {errorMsg}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 rounded-2xl btn-3d-gold text-white font-title font-black text-2xl uppercase tracking-widest shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin" />
                  ĐANG XỬ LÝ...
                </>
              ) : (
                <>
                  <Trophy className="w-7 h-7" />
                  XÁC NHẬN
                </>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </main>
  );
}
