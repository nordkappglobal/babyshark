"use client";

import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function Confetti() {
  const { width, height } = useWindowSize();
  const [show, setShow] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 8000); // 8 seconds of confetti
    return () => clearTimeout(timer);
  }, []);

  if (!isClient || !show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <ReactConfetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={800}
        gravity={0.15}
        initialVelocityY={20}
      />
    </div>
  );
}
