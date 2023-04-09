import { z } from "zod";

export const createLeagueSchema = z.object({
  slug: z.string(),
  isPrivate: z.boolean(),
  name: z.string(),
});
export const getLeagueInfoSchema = z.object({ leagueId: z.string() });

export const getLeaguesByQuerySchema = z.object({ query: z.string() });
