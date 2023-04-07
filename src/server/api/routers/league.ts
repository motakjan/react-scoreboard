import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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

      return league;
    }),
});
