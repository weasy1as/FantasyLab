import { getTopScorers } from "@/lib/utils";
import PlayerDisplay from "./PlayerDisplay";

export default async function TopScorers() {
  const players = await getTopScorers(4);

  return (
    <section className="py-20 w-full">
      <h2 className="text-3xl font-semibold mb-8 text-neutral-100">
        Top Scorers
      </h2>

      <div className="">
        <PlayerDisplay players={players} topscore={true} />
      </div>
    </section>
  );
}
