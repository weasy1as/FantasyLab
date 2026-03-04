// app/page.tsx
import Image from "next/image";

import heroPlayers from "@/public/Hero.png";
import logoFantasy from "@/public/Fantasylogo.svg";
import LandingNavBar from "@/components/LandingNavBar";
import { SiPremierleague } from "react-icons/si";
import TopScorers from "@/components/TopScorers";
import TopAssists from "@/components/TopAssists";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-neutral-900 to-black text-white overflow-x-hidden">
      {/* HERO */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between mt-20 px-6 lg:px-20 gap-12">
        {/* Image */}
        <div className="relative flex-1 rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={heroPlayers}
            alt="Fantasy football players"
            className="object-cover w-full h-96 hidden md:block lg:h-130"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fantasy Football Analytics
            </span>
            <span className="block text-neutral-300 text-2xl md:text-3xl mt-3">
              Powered by AI Insights
            </span>
          </h1>

          <p className="text-neutral-300 text-base md:text-lg mb-8 max-w-md">
            Compare players, analyze stats, and make smarter decisions with
            advanced AI-powered fantasy football insights.
          </p>

          <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
            <button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:scale-105 transition-
    t   ransform shadow
  -     lg"
            >
              Explore Players
            </button>

            <button className="px-6 py-3 rounded-xl border border-indigo-600 text-indigo-200 bg-black/30 hover:bg-black/40 transition">
              Compare Players
            </button>
          </div>
        </div>
      </section>

      {/* TRENDING PLAYERS */}
      <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-semibold mb-8">Trending Players</h2>
        <TopScorers />
        <TopAssists />
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-neutral-800 text-neutral-500 py-10 text-center mt-auto">
        <p>© 2026 Fantasy Lab — Built with Next.js</p>
      </footer>
    </main>
  );
}
