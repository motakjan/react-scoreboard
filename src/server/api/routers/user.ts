import { users } from "@clerk/nextjs/dist/api";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  setWatchlist: privateProcedure
    .input(z.object({ userId: z.string(), leagues: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      await users.updateUser(input.userId, {
        publicMetadata: { leagues: input.leagues },
      });

      return input.leagues;
    }),
  getUserWatchlist: publicProcedure.query(async ({ ctx }) => {
    if (ctx.userId) {
      const watchlist = (await users.getUser(ctx.userId)).publicMetadata
        .leagues as string[];

      return watchlist || [];
    }

    return [];
  }),
});
