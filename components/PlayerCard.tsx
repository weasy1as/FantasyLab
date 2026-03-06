"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
import { positions } from "@/lib/utils";
import PlayerImage from "./PlayerImage";
import { getPlayerImg } from "@/lib/fpl";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  ChevronRight,
} from "lucide-react";

type Props = {
  player: Player;
};
type VerdictType = "positive" | "neutral" | "negative";

type Bullet = {
  icon: "up" | "down" | "neutral";
  text: string;
};

type AiInsight = {
  verdict: string;
  verdictType: VerdictType;
  summary: string;
  bullets: Bullet[];
  captainScore: number;
};

function AiInsightPanel({
  player,
  insight,
}: {
  player: Player;
  insight: AiInsight;
}) {
  const {
    verdict = "N/A",
    verdictType = "neutral",
    summary = "",
    bullets = [],
    captainScore = 0,
  } = insight || {};

  const verdictColors = {
    positive:
      "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    neutral:
      "from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400",
    negative: "from-red-500/20 to-rose-500/10 border-red-500/30 text-red-400",
  };

  return (
    <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 to-neutral-900/60 p-4 space-y-4">
      {/* AI Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">
            AI Scout Report
          </p>
          <p className="text-[10px] text-neutral-500">
            {player.web_name} · GW analysis
          </p>
        </div>
      </div>

      {/* Verdict chip */}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-gradient-to-r text-xs font-bold ${verdictColors[verdictType]}`}
      >
        <TrendingUp className="w-3 h-3" />
        {verdict}
      </div>

      {/* Summary */}
      <p className="text-sm text-neutral-300 leading-relaxed">{summary}</p>

      {/* Bullets */}
      <ul className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            {b.icon === "up" && (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
            )}
            {b.icon === "down" && (
              <TrendingDown className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
            )}
            {b.icon === "neutral" && (
              <Minus className="w-3.5 h-3.5 text-yellow-400 mt-0.5 shrink-0" />
            )}
            <span className="text-neutral-300">{b.text}</span>
          </li>
        ))}
      </ul>

      {/* Captain score */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
        <span className="text-[10px] uppercase tracking-widest text-neutral-500">
          Captain Score
        </span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-28 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ width: `${captainScore}%` }}
            />
          </div>
          <span className="text-xs font-bold text-indigo-300">
            {captainScore}/100
          </span>
        </div>
      </div>

      <p className="text-[10px] text-neutral-600 italic">
        * AI analysis is illustrative and not financial advice.
      </p>
    </div>
  );
}

// ── stat component ────────────────────────────────────────────────────────────

function Stat({
  label,
  value,
  highlight = false,
  large = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  large?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-neutral-500 text-[10px] uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`font-bold ${large ? "text-2xl" : "text-sm"} ${
          highlight
            ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            : "text-neutral-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ── main card ─────────────────────────────────────────────────────────────────

export function PlayerCard({ player }: Props) {
  const [showInsight, setShowInsight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any | null>(null);

  async function fetchInsight(player: Player) {
    const playerData = {
      name: `${player.first_name} ${player.second_name}`,
      price: player.now_cost / 10,
      ownership: Number(player.selected_by_percent),
      total_points: player.total_points,
      points_per_game: Number(player.points_per_game),
      form: Number(player.form),
      minutes: player.minutes,
      goals: player.goals_scored,
      assists: player.assists,
      xg: Number(player.expected_goals),
      xa: Number(player.expected_assists),
      xgi: Number(player.expected_goal_involvements),
      influence: Number(player.influence),
      creativity: Number(player.creativity),
      threat: Number(player.threat),
      ict_index: Number(player.ict_index),
      bonus: player.bonus,
      yellow_cards: player.yellow_cards,
      expected_goals_per_90: player.expected_goals_per_90,
      expected_assists_per_90: player.expected_assists_per_90,
      availability: player.chance_of_playing_next_round,
    };

    const res = await fetch("/api/player-insight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerData),
    });

    return res.json();
  }

  const position = positions[player.element_type];
  const price = (player.now_cost / 10).toFixed(1);
  console.log(player);

  const statusMap = {
    a: { color: "bg-emerald-400", label: "Available" },
    d: { color: "bg-yellow-400", label: "Doubtful" },
    i: { color: "bg-red-500", label: "Injured" },
    s: { color: "bg-red-500", label: "Suspended" },
    u: { color: "bg-neutral-500", label: "Unavailable" },
  } as const;
  const status =
    statusMap[player.status as keyof typeof statusMap] ?? statusMap.u;

  async function handleInsightClick() {
    if (showInsight) {
      setShowInsight(false);
      return;
    }

    setLoading(true);

    try {
      const result = await fetchInsight(player);
      setInsight(result);
      setShowInsight(true);
    } catch (err) {
      console.error("AI insight failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* HEADER */}
      <CardHeader className="pb-0 pt-5 px-6">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-500">
              {player.first_name}
            </p>
            <h2 className="text-3xl font-black text-neutral-100 leading-none tracking-tight">
              {player.web_name}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 text-[10px] uppercase tracking-widest px-3">
              {position}
            </Badge>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${status.color}`} />
              <span className="text-[10px] text-neutral-400">
                {status.label}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* HERO — image + key stats side by side */}
      <div className="flex items-end gap-0 px-6 pt-4 pb-2">
        {/* Player image */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent rounded-xl z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-indigo-950/40 to-transparent rounded-b-xl z-10" />
          <div className="relative rounded-xl overflow-hidden bg-neutral-800">
            <PlayerImage
              src={getPlayerImg(player.photo)}
              alt={player.web_name}
              width={130}
              height={140}
            />
          </div>
        </div>

        {/* Hero stats — price + points prominent */}
        <div className="flex-1 pl-5 pb-2 space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Stat label="Price" value={`£${price}m`} highlight large />
            <Stat label="Points" value={player.total_points} highlight large />
            <Stat label="Form" value={player.form} />
            <Stat label="PPG" value={player.points_per_game} />
          </div>
        </div>
      </div>

      <CardContent className="px-6 pb-6 space-y-5">
        <Separator className="bg-neutral-800" />

        {/* SECONDARY STATS */}
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Selected %" value={`${player.selected_by_percent}%`} />
          <Stat label="Minutes" value={player.minutes} />
          <Stat label="BPS" value={player.bps} />
        </div>

        <Separator className="bg-neutral-800" />

        {/* CONTRIBUTIONS */}
        <div className="grid grid-cols-4 gap-3">
          {(player.element_type === 1 || player.element_type === 2) && (
            <div className="col-span-1 flex flex-col items-center justify-center rounded-xl bg-neutral-800/60 py-3 px-2 text-center">
              <span className="text-xl font-black text-neutral-100">
                {player.clean_sheets}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 mt-0.5">
                CS
              </span>
            </div>
          )}
          <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-800/60 py-3 px-2 text-center">
            <span className="text-xl font-black text-neutral-100">
              {player.goals_scored}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-neutral-500 mt-0.5">
              Goals
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-800/60 py-3 px-2 text-center">
            <span className="text-xl font-black text-neutral-100">
              {player.assists}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-neutral-500 mt-0.5">
              Assists
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-800/60 py-3 px-2 text-center">
            <span className="text-xl font-black text-neutral-100">
              {player.bonus}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-neutral-500 mt-0.5">
              Bonus
            </span>
          </div>
        </div>

        <Separator className="bg-neutral-800" />

        {/* AI INSIGHT BUTTON */}
        <Button
          onClick={handleInsightClick}
          disabled={loading}
          className={`w-full rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
            showInsight
              ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20"
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Analysing player…
            </span>
          ) : showInsight ? (
            <span className="flex items-center gap-2">
              <X className="w-4 h-4" /> Hide AI Insight
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Insight
              <ChevronRight className="w-4 h-4 ml-auto" />
            </span>
          )}
        </Button>

        {/* AI INSIGHT PANEL */}
        {showInsight && insight && (
          <AiInsightPanel player={player} insight={insight} />
        )}
      </CardContent>
    </Card>
  );
}
