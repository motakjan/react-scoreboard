import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createPlayerSchema,
  deletePlayerSchema,
  getPlayersByLeagueSchema,
  updatePlayerSchema,
} from "../schemas/playerSchemas";

export const playerRouter = createTRPCRouter({
  create: privateProcedure
    .input(createPlayerSchema)
    .mutation(async ({ ctx, input: { leagueId, name, mmr } }) => {
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
    .input(updatePlayerSchema)
    .mutation(async ({ ctx, input: { id, name, mmr } }) => {
      const player = await ctx.prisma.player.update({
        where: { id },
        data: {
          name,
          mmr,
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
    .input(deletePlayerSchema)
    .mutation(async ({ ctx, input: { id } }) => {
      const player = await ctx.prisma.player.update({
        where: { id },
        data: { deleted: true },
      });

      return player;
    }),

  getPlayersByLeagueId: publicProcedure
    .input(getPlayersByLeagueSchema)
    .query(async ({ ctx, input: { leagueId } }) => {
      const league = await ctx.prisma.league.findUnique({
        where: { id: leagueId },
      });

      if (!league) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "League not found",
        });
      }

      const players = ctx.prisma.player.findMany({
        where: { leagueId: leagueId, deleted: false },
      });

      return players;
    }),
});
