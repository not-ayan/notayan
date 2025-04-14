"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/assets/img/logo.svg";

interface SiteLoaderProps {
  onLoadComplete?: () => void;
}

export function SiteLoader({ onLoadComplete }: SiteLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start exit animation after delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadComplete?.();
      // Add small delay before removing from DOM
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Shorter fade-out duration
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 grid place-items-center bg-background transition-opacity duration-300 ${
        !isLoading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className={`transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        !isLoading ? "translate-y-2 opacity-0 scale-[0.98]" : "translate-y-0 opacity-100 scale-100"
      }`}>
        <div className="w-[180px] h-[75px] relative animate-fade-in-up">
          <Image
            src={Logo}
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
} 