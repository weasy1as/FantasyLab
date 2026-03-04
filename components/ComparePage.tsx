"use client";

import { useState } from "react";
import { Player } from "@/types/player";
import { PlayerSearch } from "@/components/PlayerSearch";
import { CompareCard } from "@/components/CompareCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeftRight,
} from "lucide-react";

// ── dummy AI comparison data ──────────────────────────────────────────────────

function getDummyComparison(a: Player, b: Player) {
  return {
    winner: a.web_name,
    loser: b.web_name,
    summary: `${a.web_name} edges out ${b.web_name} this gameweek. While both players are in solid form, ${a.web_name}'s superior fixture run and higher floor make him the safer pick. ${b.web_name} has the upside for big hauls but carries more risk given his recent rotation concerns.`,
    bullets: [
      {
        icon: "up",
        player: a.web_name,
        text: "Better fixtures over the next 4 GWs (avg FDR 2.1 vs 3.4)",
      },
      {
        icon: "up",
        player: a.web_name,
        text: "Higher PPG this season (7.2 vs 5.8)",
      },
      {
        icon: "up",
        player: b.web_name,
        text: "Higher ownership — safer for rank protection",
      },
      {
        icon: "down",
        player: b.web_name,
        text: "Missed training session this week — slight doubt",
      },
      {
        icon: "neutral",
        player: null,
        text: "Both are solid captain options in their respective fixtures",
      },
    ],
    captainPick: a.web_name,
    captainReason: `${a.web_name} is the recommended captain this week due to a home fixture against a side conceding 2+ chances per game.`,
  };
}

// ── AI comparison panel ───────────────────────────────────────────────────────

function AiComparisonPanel({
  playerA,
  playerB,
}: {
  playerA: Player;
  playerB: Player;
}) {
  const data = getDummyComparison(playerA, playerB);

  return (
    <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 to-neutral-900/60 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold uppercase tracking-widest text-indigo-300">
            AI Head-to-Head
          </p>
          <p className="text-[11px] text-neutral-500">
            {playerA.web_name} vs {playerB.web_name}
          </p>
        </div>
        {/* Winner badge */}
        <div className="ml-auto px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          ✦ {data.winner} wins
        </div>
      </div>

      <Separator className="bg-indigo-500/10" />

      {/* Summary */}
      <p className="text-sm text-neutral-300 leading-relaxed">{data.summary}</p>

      {/* Bullets */}
      <ul className="space-y-2.5">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            {b.icon === "up" && (
              <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            )}
            {b.icon === "down" && (
              <TrendingDown className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            )}
            {b.icon === "neutral" && (
              <Minus className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
            )}
            <span className="text-neutral-300">
              {b.player && (
                <span
                  className={`font-bold mr-1 ${b.player === playerA.web_name ? "text-indigo-300" : "text-pink-300"}`}
                >
                  {b.player}
                </span>
              )}
              {b.text}
            </span>
          </li>
        ))}
      </ul>

      <Separator className="bg-indigo-500/10" />

      {/* Captain pick */}
      <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-extrabold">
          ⚽ Captain Recommendation
        </p>
        <p className="text-sm font-bold text-neutral-100">{data.captainPick}</p>
        <p className="text-xs text-neutral-400">{data.captainReason}</p>
      </div>

      <p className="text-[10px] text-neutral-600 italic">
        * AI analysis is illustrative and not financial advice.
      </p>
    </div>
  );
}

// ── empty slot ────────────────────────────────────────────────────────────────

function EmptySlot({ side, label }: { side: "left" | "right"; label: string }) {
  const border =
    side === "left" ? "border-indigo-500/20" : "border-pink-500/20";
  const text = side === "left" ? "text-indigo-500/40" : "text-pink-500/40";
  const dot = side === "left" ? "bg-indigo-500/30" : "bg-pink-500/30";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed ${border} min-h-[420px] gap-4`}
    >
      <div
        className={`w-16 h-16 rounded-full ${dot} flex items-center justify-center`}
      >
        <span className={`text-3xl font-black ${text}`}>
          {side === "left" ? "A" : "B"}
        </span>
      </div>
      <p className={`text-sm font-semibold ${text} uppercase tracking-widest`}>
        {label}
      </p>
    </div>
  );
}

// ── main page component ───────────────────────────────────────────────────────

interface Props {
  players: Player[];
}

export function ComparePage({ players }: Props) {
  const [playerA, setPlayerA] = useState<Player | null>(null);
  const [playerB, setPlayerB] = useState<Player | null>(null);
  const [showAi, setShowAi] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  // truthy only when both players are selected
  const canCompare: boolean = Boolean(playerA && playerB);

  function handleAiClick() {
    if (showAi) {
      setShowAi(false);
      return;
    }
    setLoadingAi(true);
    setTimeout(() => {
      setLoadingAi(false);
      setShowAi(true);
    }, 1400);
  }

  function swapPlayers() {
    setPlayerA(playerB);
    setPlayerB(playerA);
    setShowAi(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-neutral-900 to-black px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page title */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">
            FPL Scout
          </p>
          <h1 className="text-4xl font-black text-neutral-100 tracking-tight leading-none">
            Compare{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Players
            </span>
          </h1>
          <p className="text-sm text-neutral-500">
            Search for two players to see a head-to-head breakdown
          </p>
        </div>

        {/* Search row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold ml-1">
              Player A
            </p>
            <PlayerSearch
              players={players}
              onSelect={(p) => {
                setPlayerA(p);
                setShowAi(false);
              }}
              placeholder="Search first player…"
              accentColor="indigo"
            />
            {playerA && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-xs font-semibold text-indigo-300">
                  {playerA.web_name}
                </span>
                <button
                  onClick={() => {
                    setPlayerA(null);
                    setShowAi(false);
                  }}
                >
                  <X className="w-3.5 h-3.5 text-indigo-400/60 hover:text-indigo-300 transition-colors" />
                </button>
              </div>
            )}
          </div>

          {/* Swap button */}
          <div className="flex justify-center mt-5">
            <button
              onClick={swapPlayers}
              disabled={!canCompare}
              className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Swap players"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-pink-400 font-bold ml-1">
              Player B
            </p>
            <PlayerSearch
              players={players}
              onSelect={(p) => {
                setPlayerB(p);
                setShowAi(false);
              }}
              placeholder="Search second player…"
              accentColor="pink"
            />
            {playerB && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <span className="text-xs font-semibold text-pink-300">
                  {playerB.web_name}
                </span>
                <button
                  onClick={() => {
                    setPlayerB(null);
                    setShowAi(false);
                  }}
                >
                  <X className="w-3.5 h-3.5 text-pink-400/60 hover:text-pink-300 transition-colors" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {playerA ? (
            <CompareCard player={playerA} opponent={playerB} side="left" />
          ) : (
            <EmptySlot side="left" label="Pick Player A" />
          )}
          {playerB ? (
            <CompareCard player={playerB} opponent={playerA} side="right" />
          ) : (
            <EmptySlot side="right" label="Pick Player B" />
          )}
        </div>

        {/* AI button — only when both selected */}
        {canCompare && (
          <div className="space-y-4">
            <Button
              onClick={handleAiClick}
              disabled={loadingAi}
              className={`w-full rounded-2xl h-12 font-bold text-sm tracking-wide transition-all duration-300 ${
                showAi
                  ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/20"
              }`}
            >
              {loadingAi ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Comparing players…
                </span>
              ) : showAi ? (
                <span className="flex items-center gap-2">
                  <X className="w-4 h-4" /> Hide AI Comparison
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Head-to-Head Analysis
                  <span className="ml-1 text-[10px] bg-white/20 rounded-full px-2 py-0.5">
                    {playerA?.web_name} vs {playerB?.web_name}
                  </span>
                </span>
              )}
            </Button>

            {showAi && playerA && playerB && (
              <AiComparisonPanel playerA={playerA} playerB={playerB} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
