// app/page.tsx
import Image from "next/image";

import heroPlayers from "@/public/Hero.png";
import { SiPremierleague } from "react-icons/si";
import TopScorers from "@/components/TopScorers";
import TopAssists from "@/components/TopAssists";
import Link from "next/link";
import { getBootstrap } from "@/lib/fpl";

import LandingSearch from "@/components/LandingSearch";

export default async function LandingPage() {
  const players = await getBootstrap();
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-neutral-900 to-black text-white overflow-x-hidden">
      {/* HERO */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between mt-20 px-6 lg:px-20 gap-12">
        {/* Image */}
        <div className="relative flex-1 h-60 lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl block md:hidden">
          <Image
            src={heroPlayers}
            alt="Fantasy football players"
            className="object-cover"
            priority
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center   text-center  w-full justify-center">
          <div className="hidden md:block">
            <SiPremierleague size={140} />
          </div>
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
            <a
              href="#search"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Explore Players
            </a>

            <Link
              href="/compare"
              className="
    cursor-pointer
    px-6 py-3
    rounded-xl
    border border-indigo-600
    text-indigo-200
    bg-black/30
    transition-all
    duration-300
    hover:border-transparent
    hover:text-white
    hover:bg-gradient-to-r
    hover:from-indigo-500
    hover:to-purple-500
  "
            >
              Compare Players
            </Link>
          </div>
        </div>
      </section>

      <section
        id="search"
        className="flex items-center justify-center py-9 md:px-40  "
      ></section>

      {/* TRENDING PLAYERS */}
      {/* SEARCH + STATS */}
      <section
        id="search"
        className="py-20 px-6 lg:px-20 max-w-7xl mx-auto w-full scroll-mt-24"
      >
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Find & Analyze{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Any Player
            </span>
          </h2>

          <p className="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base">
            Search Premier League players, compare statistics, and get
            AI-powered insights to improve your Fantasy Premier League
            decisions.
          </p>
        </div>

        {/* Search */}
        <div className="mb-16">
          <LandingSearch players={players.elements} />
        </div>

        {/* Trending Section */}
        <div className="space-y-12">
          <TopScorers />
          <TopAssists />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-neutral-800 text-neutral-500 py-10 text-center mt-auto">
        <p>© 2026 Fantasy Lab — Built with Next.js</p>
      </footer>
    </main>
  );
}
