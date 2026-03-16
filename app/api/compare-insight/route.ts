import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { playerA, playerB } = await req.json();

    if (!playerA || !playerB) {
      return NextResponse.json(
        { error: "Both playerA and playerB data are required" },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert Fantasy Premier League analyst.

Analyze these two players head-to-head and return ONLY valid JSON.

The JSON format must be:

{
  "winner": "Player A name | Player B name",
  "loser": "The other player name",
  "summary": "Short 2-3 sentence summary of the comparison",
  "bullets": [
    {"icon": "up | down | neutral", "player": "Player A name | Player B name | null", "text": "bullet insight"},
    {"icon": "up | down | neutral", "player": "Player A name | Player B name | null", "text": "bullet insight"},
    {"icon": "up | down | neutral", "player": "Player A name | Player B name | null", "text": "bullet insight"}
  ],
  "captainPick": "Player A name | Player B name",
  "captainReason": "Reason for captain pick"
}

Return ONLY JSON. No explanation. No markdown.

Player A: ${playerA.name}

Stats:
Price: ${playerA.price}
Ownership: ${playerA.ownership}%
Total Points: ${playerA.total_points}
Points Per Game: ${playerA.points_per_game}
Form: ${playerA.form}
Minutes: ${playerA.minutes}

Attacking:
Goals: ${playerA.goals}
Assists: ${playerA.assists}
xG: ${playerA.xg}
xA: ${playerA.xa}
xGI: ${playerA.xgi}

Advanced:
Influence: ${playerA.influence}
Creativity: ${playerA.creativity}
Threat: ${playerA.threat}
ICT Index: ${playerA.ict_index}

Discipline:
Yellow Cards: ${playerA.yellow_cards}

Per 90:
xG per 90: ${playerA.expected_goals_per_90}
xA per 90: ${playerA.expected_assists_per_90}

Availability: ${playerA.availability}%

Player B: ${playerB.name}

Stats:
Price: ${playerB.price}
Ownership: ${playerB.ownership}%
Total Points: ${playerB.total_points}
Points Per Game: ${playerB.points_per_game}
Form: ${playerB.form}
Minutes: ${playerB.minutes}

Attacking:
Goals: ${playerB.goals}
Assists: ${playerB.assists}
xG: ${playerB.xg}
xA: ${playerB.xa}
xGI: ${playerB.xgi}

Advanced:
Influence: ${playerB.influence}
Creativity: ${playerB.creativity}
Threat: ${playerB.threat}
ICT Index: ${playerB.ict_index}

Discipline:
Yellow Cards: ${playerB.yellow_cards}

Per 90:
xG per 90: ${playerB.expected_goals_per_90}
xA per 90: ${playerB.expected_assists_per_90}

Availability: ${playerB.availability}%
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
      { error: "Failed to generate AI comparison" },
      { status: 500 },
    );
  }
}