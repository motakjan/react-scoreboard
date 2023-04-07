import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { calculateNewMMR } from "../../helpers/elo";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const matchRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        leagueId: z.string(),
        homePlayerId: z.string(),
        awayPlayerId: z.string(),
        homeScore: z.number(),
        awayScore: z.number(),
        overtime: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        leagueId,
        homePlayerId,
        awayPlayerId,
        homeScore,
        awayScore,
        overtime,
      } = input;

      const league = await ctx.prisma.league.findUnique({
        where: { id: leagueId },
      });

      if (!league) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League not found",
        });
      }

      const homePlayer = await ctx.prisma.player.findUnique({
        where: { id: homePlayerId },
      });

      const awayPlayer = await ctx.prisma.player.findUnique({
        where: { id: awayPlayerId },
      });

      if (!homePlayer || !awayPlayer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One of the players not found",
        });
      }

      const [homeNewRating, awayNewRating] = calculateNewMMR(
        homePlayer.mmr,
        awayPlayer.mmr,
        homeScore,
        awayScore
      );

      if (!homeNewRating || !awayNewRating) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One of the players score is not defined",
        });
      }

      const match = ctx.prisma.match.create({
        data: {
          leagueId,
          homePlayerId,
          awayPlayerId,
          homeScore,
          awayScore,
          overtime,
        },
      });

      await ctx.prisma.player.update({
        where: { id: homePlayerId },
        data: {
          mmr: Math.round(homeNewRating),
        },
      });

      await ctx.prisma.player.update({
        where: { id: awayPlayerId },
        data: {
          mmr: Math.round(awayNewRating),
        },
      });

      return match;
    }),
});
