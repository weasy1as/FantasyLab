"use client";
import React from "react";
import PlayerImage from "./PlayerImage";
import { redirect } from "next/navigation";
import { getPlayerImg } from "@/lib/fpl";
import { Player } from "@/types/player";

type PlayerDisplayProps = {
  players: Player[];
  topscore?: boolean;
  assist?: boolean;
};

const PlayerDisplay = ({ players, topscore, assist }: PlayerDisplayProps) => {
  const positions: Record<number, string> = {
    1: "GK",
    2: "DEF",
    3: "MID",
    4: "FWD",
  };

  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
      {players.map((p: Player) => {
        const highlightStat = topscore
          ? { label: "Goals", value: p.goals_scored }
          : assist
            ? { label: "Assists", value: p.assists }
            : { label: "Form", value: p.form };

        return (
          <div
            key={p.id}
            onClick={() => redirect(`/players/${p.bps}`)}
            className="
              group
              relative
              bg-neutral-900/70
              backdrop-blur-lg
              border border-neutral-800
              rounded-2xl
              p-5
              cursor-pointer
              transition-all duration-300
              hover:border-purple-500
              hover:shadow-xl
              hover:shadow-purple-900/20
              hover:-translate-y-1
            "
          >
            <div className="flex flex-col items-center gap-4">
              {/* Player Image */}
              <div className="shrink-0">
                <PlayerImage src={getPlayerImg(p.photo)} alt={p.web_name} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-white truncate">
                  {p.web_name}
                </h3>

                <p className="text-xs tracking-widest text-purple-400 font-semibold">
                  {positions[p.element_type]}
                </p>

                <div className="mt-2 space-y-1 text-sm text-neutral-400">
                  <p>£{p.now_cost / 10}m</p>
                  <p>{p.total_points} pts</p>
                </div>
              </div>

              {/* Highlight Stat */}
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-neutral-500">
                  {highlightStat.label}
                </p>
                <p className="text-3xl font-extrabold text-white group-hover:text-purple-400 transition">
                  {highlightStat.value}
                </p>
              </div>
            </div>

            {/* Subtle bottom glow */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </div>
        );
      })}
    </div>
  );
};

export default PlayerDisplay;
