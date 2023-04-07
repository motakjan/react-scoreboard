import { type League, type Match, type Player } from "@prisma/client";
import { getPlayerScore } from "~/utils/scoreCalculation";

type CompleteLeague = League & {
  players: (Player & {
    matchesAsHomePlayer: Match[];
    matchesAsAwayPlayer: Match[];
  })[];
  matches: (Match & {
    homePlayer: Player;
    awayPlayer: Player;
  })[];
};

export type LeagueStats = {
  player:
    | (Player & {
        matchesAsHomePlayer: Match[];
        matchesAsAwayPlayer: Match[];
      })
    | null;
  stat: string;
  name: string;
};

export const getLeagueStats = (league: CompleteLeague) => {
  let bestWinratePlayer = null;
  let bestWinrate = 0;
  let bestAvgGoalsPlayer = null;
  let bestAvgGoals = 0;
  let bestAvgGoalsAgainstPlayer = null;
  let bestAvgGoalsAgainst = Infinity;

  for (const player of league.players) {
    const { winrate, avgGoalsScored, avgGoalsScoredAgainst } =
      getPlayerScore(player);

    if (winrate > bestWinrate) {
      bestWinrate = winrate;
      bestWinratePlayer = player;
    }

    if (avgGoalsScored > bestAvgGoals) {
      bestAvgGoals = avgGoalsScored;
      bestAvgGoalsPlayer = player;
    }

    if (avgGoalsScoredAgainst < bestAvgGoalsAgainst) {
      bestAvgGoalsAgainst = avgGoalsScoredAgainst;
      bestAvgGoalsAgainstPlayer = player;
    }
  }

  return [
    {
      player: bestWinratePlayer,
      stat: bestWinrate.toFixed(2) + "%",
      name: "Winrate",
    },
    {
      player: bestAvgGoalsPlayer,
      stat: bestAvgGoals.toFixed(2),
      name: "Best average G",
    },
    {
      player: bestAvgGoalsAgainstPlayer,
      stat: bestAvgGoalsAgainst.toFixed(2),
      name: "Best average GA",
    },
  ];
};
