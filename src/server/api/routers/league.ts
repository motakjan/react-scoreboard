import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const leagueRouter = createTRPCRouter({
  create: privateProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(({ ctx, input }) => {
      const league = ctx.prisma.league.create({
        data: { ownerClerkId: ctx.userId, slug: input.slug },
      });

      return league;
    }),
});
