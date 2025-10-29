"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Suspense } from "react";
import 'katex/dist/katex.min.css';
import { usePathname } from "next/navigation";

const HEADER_H = 64;

const Main = ({ children }) => {

  const pathname = usePathname();

  const segs = pathname.split("/").filter(Boolean);
  const hideSidebar = segs[0] === "books" && segs.length === 2;
  return (
    <Suspense>
      <div className="flex flex-col h-screen overflow-hidden">
        <div style={{ height: HEADER_H }}>
          <Header />
        </div>

        <div className="flex flex-1 min-h-0">
          {!hideSidebar && (
            <aside className="hidden lg:flex lg:w-64 shrink-0 border-r border-gray-200 bg-white sticky thin-scrollbar">
              <Sidebar />
            </aside>
          )}

          <main
            className="flex-1 bg-gray-50 overflow-y-auto min-h-0"
            style={{ height: `calc(100vh - ${HEADER_H}px)` }}
          >
            <div className="p-4">{children}</div>
          </main>
        </div>
      </div>
    </Suspense>
  );
};

export default Main;
