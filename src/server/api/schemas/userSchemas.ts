import { z } from "zod";

export const setWatchlistSchema = z.object({
  userId: z.string(),
  leagues: z.array(z.string()),
});
