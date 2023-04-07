import { type Match, type Player } from "@prisma/client";

export type Stats = {
  goalsScored: number;
  goalsScoredAgainst: number;
  regularWins: number;
  otWins: number;
  regularLosses: number;
  otLosses: number;
  gamesPlayed: number;
};

export type PlayerWithMatches = Player & {
  matchesAsHomePlayer: Match[];
  matchesAsAwayPlayer: Match[];
};
