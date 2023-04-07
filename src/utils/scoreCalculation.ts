import { type Match } from "@prisma/client";
import { type PlayerWithMatches, type Stats } from "~/types/leagueTypes";

const processMatch = (match: Match, isHomePlayer: boolean, stats: Stats) => {
  stats.goalsScored += isHomePlayer ? match.homeScore : match.awayScore;
  stats.goalsScoredAgainst += isHomePlayer ? match.awayScore : match.homeScore;

  if (match.homeScore > match.awayScore) {
    if (isHomePlayer && match.overtime) {
      stats.otWins += 1;
    } else if (isHomePlayer && !match.overtime) {
      stats.regularWins += 1;
    } else if (!isHomePlayer && match.overtime) {
      stats.otLosses += 1;
    } else if (!isHomePlayer && !match.overtime) {
      stats.regularLosses += 1;
    }
  } else if (match.homeScore < match.awayScore) {
    if (isHomePlayer && match.overtime) {
      stats.otLosses += 1;
    } else if (isHomePlayer && !match.overtime) {
      stats.regularLosses += 1;
    } else if (!isHomePlayer && match.overtime) {
      stats.otWins += 1;
    } else if (!isHomePlayer && !match.overtime) {
      stats.regularWins += 1;
    }
  }
};

export const getPlayerScore = (player: PlayerWithMatches) => {
  const stats: Stats = {
    goalsScored: 0,
    goalsScoredAgainst: 0,
    regularWins: 0,
    otWins: 0,
    regularLosses: 0,
    otLosses: 0,
  };

  for (const match of player.matchesAsHomePlayer) {
    processMatch(match, true, stats);
  }

  for (const match of player.matchesAsAwayPlayer) {
    processMatch(match, false, stats);
  }

  return [
    stats.goalsScored,
    stats.goalsScoredAgainst,
    stats.regularWins,
    stats.otWins,
    stats.regularLosses,
    stats.otLosses,
  ];
};
