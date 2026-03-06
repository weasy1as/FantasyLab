import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const player = await req.json();

    if (!player) {
      return NextResponse.json(
        { error: "Player data is required" },
        { status: 400 },
      );
    }

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

Return ONLY JSON. No explanation. No markdown.

Player: ${player.name}

Stats:
Price: ${player.price}
Ownership: ${player.ownership}%
Total Points: ${player.total_points}
Points Per Game: ${player.points_per_game}
Form: ${player.form}
Minutes: ${player.minutes}

Attacking:
Goals: ${player.goals}
Assists: ${player.assists}
xG: ${player.xg}
xA: ${player.xa}
xGI: ${player.xgi}

Advanced:
Influence: ${player.influence}
Creativity: ${player.creativity}
Threat: ${player.threat}
ICT Index: ${player.ict_index}

Discipline:
Yellow Cards: ${player.yellow_cards}

Per 90:
xG per 90: ${player.expected_goals_per_90}
xA per 90: ${player.expected_assists_per_90}

Availability: ${player.availability}%
`;
    // Call OpenAI API
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
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      },
    );
    const completion = await openaiRes.json();
    const insight = completion.choices[0].message.content;

    return NextResponse.json(JSON.parse(insight));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate AI insight" },
      { status: 500 },
    );
  }
}
