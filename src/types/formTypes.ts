export type PlayerValues = {
  mmr: string;
  name: string;
  id?: string;
};

export type MatchValues = {
  homePlayerId: string;
  awayPlayerId: string;
  homeScore: number;
  awayScore: number;
  overtime: boolean;
};

export type CreateLeagueValues = {
  isPrivate: boolean;
  leagueName: string;
};
