import { z } from "zod";

export const createLeagueSchema = z.object({ slug: z.string() });
export const getLeagueInfoSchema = z.object({ leagueId: z.string() });
