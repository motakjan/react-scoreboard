import { users } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { setWatchlistSchema } from "../schemas/userSchemas";

export const userRouter = createTRPCRouter({
  setWatchlist: privateProcedure
    .input(setWatchlistSchema)
    .mutation(async ({ input: { userId, leagues } }) => {
      await users.updateUser(userId, {
        publicMetadata: { leagues },
      });

      return leagues;
    }),

  getUserWatchlist: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
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
