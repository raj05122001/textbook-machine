// books/page.jsx
"use client";

import React, { useState } from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BooksPage() {
    const router = useRouter()
  const [books] = useState([
    {
      id: 1,
      title: "Mathematics for Class 10",
      subtitle: "Algebra • Geometry • Trigonometry • Statistics",
      author: "Textbook Machine",
      color: "from-emerald-500 to-teal-600",
      chapters: ["Algebra", "Geometry", "Trigonometry", "Statistics"],
    },
    {
      id: 2,
      title: "Physics Essentials",
      subtitle: "Motion • Force • Energy • Electricity • Magnetism",
      author: "Textbook Machine",
      color: "from-indigo-500 to-blue-600",
      chapters: ["Motion", "Force", "Work & Energy", "Electricity", "Magnetism"],
    },
    {
      id: 3,
      title: "Chemistry Basics",
      subtitle: "Atoms • Molecules • Reactions • Acids & Bases",
      author: "Textbook Machine",
      color: "from-rose-500 to-orange-500",
      chapters: ["Atoms & Molecules", "Chemical Reactions", "Acids & Bases", "Salts"],
    },
  ]);

  return (
    <div className="min-h-screen bg-[#0B0D10] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          All Books
        </h1>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={()=>router.push("/create-book")}>Create Book</button>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BookCard({ book }) {
  return (
    <div
      className="
        group relative mx-auto w-72
        [perspective:1200px]
      "
    >
      {/* 3D rotating container */}
      <div
        className="
          relative h-96 w-full rounded-lg shadow-xl
          transition-transform duration-500 ease-out
          group-hover:[transform:rotateY(-8deg) translateZ(0)]
        "
      >
        {/* Cover */}
        <div
          className={`
            absolute inset-0 rounded-lg overflow-hidden
            bg-gradient-to-br ${book.color}
            ring-1 ring-black/10
          `}
        >
          {/* subtle pattern overlay */}
          <div className="absolute inset-0 opacity-15 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35) 0 1px, transparent 2px)",
              backgroundSize: "12px 12px",
            }}
          />
          {/* cover content */}
          <div className="absolute inset-0 p-5 flex flex-col">
            <div className="text-[10px] uppercase tracking-widest opacity-80">
              {book.author}
            </div>
            <h3 className="mt-2 text-xl font-bold leading-snug">{book.title}</h3>
            <p className="mt-2 text-sm/5 text-white/85">{book.subtitle}</p>

            <div className="mt-auto">
              <div className="text-xs text-white/80">
                Chapters: {book.chapters.length}
              </div>
              <a
                href={`/books/${book.id}`}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium
                           text-white underline-offset-4 hover:underline"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Spine (left) */}
        <div
          className="
            absolute -left-3 top-0 h-full w-6 rounded-l
            bg-neutral-900/80 shadow-lg shadow-black/30
          "
        >
          {/* spine stripes */}
          <div className="absolute inset-y-0 left-1.5 w-px bg-white/10" />
          <div className="absolute inset-y-0 left-3 w-px bg-white/10" />
          <div className="absolute top-6 left-0 w-full text-[10px] text-white/70 rotate-180 [writing-mode:vertical-rl] tracking-widest">
            {book.title}
          </div>
        </div>

        {/* Page edges (right) */}
        <div
          className="
            absolute -right-2 top-2 bottom-2 w-2 rounded-r
            bg-gradient-to-b from-white to-neutral-200
            shadow-md
          "
          style={{
            backgroundImage:
              "repeating-linear-gradient( to bottom, rgba(0,0,0,0.08) 0 1px, transparent 1px 4px )",
          }}
        />

        {/* Bottom shadow for depth */}
        <div className="absolute -bottom-3 left-8 right-0 h-4 blur-md bg-black/40 rounded-full" />
      </div>
    </div>
  );
}
