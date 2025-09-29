"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Suspense } from "react";
import "katex/dist/katex.min.css";

const HEADER_H = 64; // match your Header height (px)

const Main = ({ children }) => {
  return (
    // lock layout to viewport; prevent page-level scroll
    <Suspense>
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div style={{ height: HEADER_H }}>
        <Header />
      </div>

      {/* Row: sidebar + content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar sticks under header; can scroll on its own if long */}
        <aside
          className="w-64 shrink-0 border-r bg-white sticky thin-scrollbar"
          style={{
            top: HEADER_H,
            height: `calc(100vh - ${HEADER_H}px)`,
            overflowY: "auto",
          }}
        >
          <Sidebar />
        </aside>

        {/* Main is the ONLY section that scrolls and now contains Footer */}
        <main
          className="flex-1 bg-gray-50 overflow-y-auto min-h-0"
          style={{ height: `calc(100vh - ${HEADER_H}px)` }}
        >
          <div className="p-4">{children}</div>

          {/* Footer now scrolls with content, not fixed on screen */}
          <Footer />
        </main>
      </div>
    </div>
    </Suspense>
  );
};

export default Main;
