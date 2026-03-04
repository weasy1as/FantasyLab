"use client";

import { useRouter } from "next/navigation";
import { Player } from "@/types/player";
import { PlayerSearch } from "@/components/PlayerSearch";

interface Props {
  players: Player[];
}

export default function LandingSearch({ players }: Props) {
  const router = useRouter();
  console.log(players);

  return (
    <PlayerSearch
      players={players}
      onNavigate={(player) => router.push(`/players/${player.bps}`)}
      placeholder="Search players..."
    />
  );
}
