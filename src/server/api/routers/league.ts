import { users } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getLeagueStats, type LeagueStats } from "~/server/helpers/leagueStats";
import {
  createLeagueSchema,
  getLeagueInfoSchema,
  getLeaguesByQuerySchema,
} from "../schemas/leagueSchemas";

export const leagueRouter = createTRPCRouter({
  create: privateProcedure
    .input(createLeagueSchema)
    .mutation(({ ctx, input: { slug, isPrivate, name } }) => {
      const { userId } = ctx;

      const league = ctx.prisma.league.create({
        data: { ownerClerkId: userId, slug, isPrivate, name },
      });

      return league;
    }),

  getLeaguesByQuery: publicProcedure
    .input(getLeaguesByQuerySchema)
    .query(({ ctx, input: { query } }) => {
      const leagues = ctx.prisma.league.findMany({
        where: {
          name: { contains: query },
        },
        take: 5,
      });

      return leagues;
    }),

  getLeagueInfo: publicProcedure
    .input(getLeagueInfoSchema)
    .query(async ({ ctx, input: { leagueId } }) => {
      const league = await ctx.prisma.league.findUnique({
        where: { id: leagueId },
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

      const { userId } = ctx;
      const watchlist = userId
        ? ((await users.getUser(userId)).publicMetadata.leagues as string[])
        : null;

      const stats: LeagueStats[] = getLeagueStats(league);

      let allowedUsers: string[] = [];

      if (league.isPrivate && league.allowedUsers) {
        allowedUsers = league.allowedUsers.split(",");
      }

      allowedUsers.push(league.ownerClerkId);

      return { league, stats, watchlist, allowedUsers, userId: ctx.userId };
    }),
});
