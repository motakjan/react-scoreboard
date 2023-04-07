import { users } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getLeagueStats, type LeagueStats } from "~/server/helpers/leagueStats";

export const leagueRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(({ ctx, input }) => {
      const league = ctx.prisma.league.create({
        data: { ownerClerkId: ctx.userId, slug: input.slug },
      });

      return league;
    }),
  getLeagueInfo: publicProcedure
    .input(z.object({ leagueId: z.string() }))
    .query(async ({ ctx, input }) => {
      const league = await ctx.prisma.league.findUnique({
        where: { id: input.leagueId },
        include: {
          players: {
            orderBy: { mmr: "desc" },
            where: { deleted: false },
            include: {
              matchesAsHomePlayer: true,
              matchesAsAwayPlayer: true,
            },
          },
          matches: {
            orderBy: { createdAt: "desc" },
            include: {
              homePlayer: true,
              awayPlayer: true,
            },
            where: {
              OR: [
                { homePlayer: { deleted: false } },
                { awayPlayer: { deleted: false } },
              ],
            },
          },
        },
      });

      if (!league) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League not found",
        });
      }

      let watchlist: string[] | null = null;

      if (ctx.userId) {
        watchlist = (await users.getUser(ctx.userId)).publicMetadata
          .leagues as string[];
      }

      const stats: LeagueStats[] = getLeagueStats(league);

      return { league, stats, watchlist };
    }),
});
