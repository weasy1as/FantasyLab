export type Player = {
  id: number;
  code: number;

  web_name: string;
  first_name: string;
  second_name: string;
  photo: string;

  element_type: number;
  team: number;
  team_code: number;

  now_cost: number;
  total_points: number;
  points_per_game: string;
  form: string;
  minutes: number;

  clean_sheets: number;
  goals_scored: number;
  assists: number;
  bonus: number;
  bps: number;

  selected_by_percent: string;
  status: string;

  // ── Advanced stats (used in AI + cards) ──
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;

  expected_goals_per_90: number;
  expected_assists_per_90: number;

  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;

  yellow_cards: number;
  red_cards: number;

  chance_of_playing_next_round: number | null;
  chance_of_playing_this_round: number | null;
};
