"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import styles from './ClientUserButton.module.css';

export const ClientUserButton = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className={styles.placeholder} />;

  return <UserButton />;
};
