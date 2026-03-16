import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { player, gameweek } = await req.json();

    if (!player || !gameweek) {
      return NextResponse.json(
        { error: "Player data and gameweek required" },
        { status: 400 },
      );
    }

    // 1️⃣ Check if insight already exists
    const { data: existingInsight } = await supabase
      .from("player_insights")
      .select("insight")
      .eq("player_id", player.id)
      .eq("gameweek", gameweek)
      .single();

    if (existingInsight) {
      console.log("data found");
      return NextResponse.json(existingInsight.insight);
    }

    // 2️⃣ Build prompt
    const prompt = `
You are an expert Fantasy Premier League analyst.

Analyze this player and return ONLY valid JSON.

The JSON format must be:

{
  "verdict": "Strong Buy | Buy | Hold | Avoid",
  "verdictType": "positive | neutral | negative",
  "summary": "Short 2 sentence summary",
  "bullets": [
    {"icon": "up | down | neutral", "text": "bullet insight"},
    {"icon": "up | down | neutral", "text": "bullet insight"},
    {"icon": "up | down | neutral", "text": "bullet insight"}
  ],
  "captainScore": number 1-100
}

Return ONLY JSON.

Player: ${player.name}

Price: ${player.price}
Ownership: ${player.ownership}%
Total Points: ${player.total_points}
Points Per Game: ${player.points_per_game}
Form: ${player.form}
Minutes: ${player.minutes}

Goals: ${player.goals}
Assists: ${player.assists}
xG: ${player.xg}
xA: ${player.xa}
xGI: ${player.xgi}
`;

    // 3️⃣ Call OpenAI
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an expert Fantasy Premier League analyst. Always return valid JSON only.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      },
    );

    const completion = await openaiRes.json();
    const insight = JSON.parse(completion.choices[0].message.content);

    // 4️⃣ Save insight in DB
    const { data, error } = await supabase.from("player_insights").insert({
      player_id: player.id,
      gameweek: gameweek,
      insight: insight,
    });
    console.log("Insert result:", { data, error });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate AI insight" },
      { status: 500 },
    );
  }
}
