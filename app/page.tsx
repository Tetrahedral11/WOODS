"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Menu as MenuIcon,
  X,
  Languages,
  Search,
  ChevronRight,
  Coffee,
  Pizza,
  Sandwich,
  Soup,
  IceCream,
  Salad,
  CupSoda,
  Images,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  // --- Scroll optimization to prevent Chrome crash ---
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Replace this with your actual scroll logic or animations
          console.log("Scrolling..."); // Example
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // -----------------------------------------------------

  return (
    <div className="h-[200vh]">
      {/* Example long page to allow scrolling */}
      <h1>Scroll Test Page</h1>
    </div>
  );
}
