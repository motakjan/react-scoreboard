import { z } from "zod";

export const createMatchSchema = z.object({
  leagueId: z.string(),
  homePlayerId: z.string(),
  awayPlayerId: z.string(),
  homeScore: z.number(),
  awayScore: z.number(),
  overtime: z.boolean(),
});
