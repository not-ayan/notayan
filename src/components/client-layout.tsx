"use client";

import { useState, useEffect } from "react";
import { SiteLoader } from "@/components/site-loader";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1300); // Slightly longer than loader duration to ensure smooth transition

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SiteLoader onLoadComplete={() => setIsLoading(false)} />
      {!isLoading && children}
    </>
  );
} 