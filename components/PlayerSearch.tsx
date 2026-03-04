"use client";

import { useState, useRef, useEffect } from "react";
import { Player } from "@/types/player";
import { positions } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface Props {
  players: Player[];
  onSelect?: (player: Player) => void;
  placeholder?: string;
  accentColor?: "indigo" | "pink";
  onNavigate?: (player: Player) => void;
}

export function PlayerSearch({
  players,
  onSelect,
  onNavigate,
  placeholder = "Search players…",
  accentColor = "indigo",
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.trim().length < 1
      ? []
      : players
          .filter((p) =>
            `${p.first_name} ${p.second_name} ${p.web_name}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .slice(0, 8);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(player: Player) {
    if (onSelect) onSelect(player);
    if (onNavigate) onNavigate(player);
    setQuery("");
    setOpen(false);
  }

  const ringColor =
    accentColor === "indigo"
      ? "focus-within:ring-indigo-500/50"
      : "focus-within:ring-pink-500/50";
  const badgeColor =
    accentColor === "indigo"
      ? "bg-indigo-500/20 text-indigo-300"
      : "bg-pink-500/20 text-pink-300";

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 ring-2 ring-transparent transition-all ${ringColor}`}
      >
        <Search className="w-4 h-4 text-neutral-500 shrink-0" />
        <input
          className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-600 outline-none"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
          >
            <X className="w-3.5 h-3.5 text-neutral-600 hover:text-neutral-400 transition-colors" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl shadow-black/60 overflow-hidden">
          {filtered.map((player) => {
            const position = positions[player.element_type];
            const price = (player.now_cost / 10).toFixed(1);
            return (
              <li key={player.id}>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 transition-colors text-left"
                  onMouseDown={() => handleSelect(player)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-100 truncate">
                      {player.web_name}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {player.first_name} {player.second_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${badgeColor}`}
                    >
                      {position}
                    </span>
                    <span className="text-xs text-neutral-400 font-semibold">
                      £{price}m
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
