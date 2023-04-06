import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const playerRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        leagueId: z.string(),
        mmr: z.number().min(0).max(8000),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { leagueId, name, mmr } = input;

      const league = await ctx.prisma.league.findUnique({
        where: { id: leagueId },
      });

      if (!league) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League not found",
        });
      }

      const player = ctx.prisma.player.create({
        data: { leagueId, name, mmr },
      });

      return player;
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        mmr: z.number().min(0).max(8000),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const player = await ctx.prisma.player.update({
        where: { id: input.id },
        data: {
          name: input.name,
          mmr: input.mmr,
        },
      });

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }

      return player;
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const player = await ctx.prisma.player.update({
        where: { id: input.id },
        data: { deleted: true },
      });

      return player;
    }),

  getPlayersByLeagueId: publicProcedure
    .input(z.object({ leagueId: z.string() }))
    .query(async ({ ctx, input }) => {
      const league = await ctx.prisma.league.findUnique({
        where: { id: input.leagueId },
      });

      if (!league) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League not found",
        });
      }

      const players = ctx.prisma.player.findMany({
        where: { leagueId: input.leagueId, deleted: false },
      });

      return players;
    }),
});
