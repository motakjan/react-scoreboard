import { users } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";
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
    const userId = ctx.userId;
    if (!userId) {
      return [];
    }

    const user = await users.getUser(userId);
    const { publicMetadata: { leagues = [] } = {} } = user;

    if (!Array.isArray(leagues)) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error while extracting watchlist data",
      });
    }

    if (!leagues.length) {
      return [];
    }

    const leaguesList = await ctx.prisma.league.findMany({
      where: {
        id: { in: leagues },
      },
    });

    return leaguesList;
  }),
});
