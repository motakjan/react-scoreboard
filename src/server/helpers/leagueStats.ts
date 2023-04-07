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

type NullablePlayerWithMatch =
  | (Player & {
      matchesAsHomePlayer: Match[];
      matchesAsAwayPlayer: Match[];
    })
  | null;

type LeagueStatsObj = {
  bestWinratePlayer: NullablePlayerWithMatch;
  bestWinrate: number;
  bestAvgGoalsPlayer: NullablePlayerWithMatch;
  bestAvgGoals: number;
  bestAvgGoalsAgainstPlayer: NullablePlayerWithMatch;
  bestAvgGoalsAgainst: number;
};

export const getLeagueStats = (league: CompleteLeague) => {
  const stats: LeagueStatsObj = {
    bestWinratePlayer: null,
    bestWinrate: 0,
    bestAvgGoalsPlayer: null,
    bestAvgGoals: 0,
    bestAvgGoalsAgainstPlayer: null,
    bestAvgGoalsAgainst: Infinity,
  };

  for (const player of league.players) {
    const { winrate, avgGoalsScored, avgGoalsScoredAgainst } =
      getPlayerScore(player);

    if (winrate > stats.bestWinrate) {
      stats.bestWinrate = winrate;
      stats.bestWinratePlayer = player;
    }

    if (avgGoalsScored > stats.bestAvgGoals) {
      stats.bestAvgGoals = avgGoalsScored;
      stats.bestAvgGoalsPlayer = player;
    }

    if (avgGoalsScoredAgainst < stats.bestAvgGoalsAgainst) {
      stats.bestAvgGoalsAgainst = avgGoalsScoredAgainst;
      stats.bestAvgGoalsAgainstPlayer = player;
    }
  }

  return [
    {
      player: stats.bestWinratePlayer,
      stat: stats.bestWinrate.toFixed(2) + "%",
      name: "Winrate",
    },
    {
      player: stats.bestAvgGoalsPlayer,
      stat: stats.bestAvgGoals.toFixed(2),
      name: "Best average G",
    },
    {
      player: stats.bestAvgGoalsAgainstPlayer,
      stat: stats.bestAvgGoalsAgainst.toFixed(2),
      name: "Best average GA",
    },
  ];
};
