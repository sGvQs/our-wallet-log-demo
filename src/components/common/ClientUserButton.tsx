"use client"; // クライアントコンポーネントにする

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";

export const ClientUserButton = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // マウントされる（ブラウザで準備ができる）までは何も出さない
  if (!isMounted) return <div className="w-8 h-8" />; 

  return <UserButton />;
};