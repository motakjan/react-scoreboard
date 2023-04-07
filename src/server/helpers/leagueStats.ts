import { type League, type Match, type Player } from "@prisma/client";
import { type PlayerWithMatches } from "~/types/leagueTypes";
import { getPlayerScore } from "~/utils/scoreCalculation";

type CompleteLeague = League & {
  players: PlayerWithMatches[];
  matches: (Match & {
    homePlayer: Player;
    awayPlayer: Player;
  })[];
};

export type LeagueStats = {
  player: PlayerWithMatches | null;
  stat: string;
  name: string;
};

type LeagueStatsObj = {
  bestWinratePlayer: PlayerWithMatches | null;
  bestWinrate: number;
  bestAvgGoalsPlayer: PlayerWithMatches | null;
  bestAvgGoals: number;
  bestAvgGoalsAgainstPlayer: PlayerWithMatches | null;
  bestAvgGoalsAgainst: number;
  bestScorePlayer: PlayerWithMatches | null;
  bestScore: number;
};

export const getLeagueStats = (league: CompleteLeague) => {
  const stats: LeagueStatsObj = {
    bestWinratePlayer: null,
    bestWinrate: 0,
    bestAvgGoalsPlayer: null,
    bestAvgGoals: 0,
    bestAvgGoalsAgainstPlayer: null,
    bestAvgGoalsAgainst: Infinity,
    bestScorePlayer: null,
    bestScore: -Infinity,
  };

  for (const player of league.players) {
    const {
      winrate,
      avgGoalsScored,
      avgGoalsScoredAgainst,
      goalsScored,
      goalsScoredAgainst,
    } = getPlayerScore(player);

    const score = goalsScored - goalsScoredAgainst;
    const matchesPlayed =
      player.matchesAsAwayPlayer.length + player.matchesAsHomePlayer.length;

    if (matchesPlayed < 3) {
      continue;
    }

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

    if (score > stats.bestScore) {
      stats.bestScore = score;
      stats.bestScorePlayer = player;
    }
  }

  if (
    !stats.bestWinratePlayer ||
    !stats.bestScorePlayer ||
    !stats.bestAvgGoalsAgainstPlayer ||
    !stats.bestAvgGoalsPlayer
  ) {
    return [];
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
    {
      player: stats.bestScorePlayer,
      stat: stats.bestScore.toString(),
      name: "Best score",
    },
  ];
};
