import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "~/components/Layout/Layout";
import { MatchInfo } from "~/components/Matches/Match";
import { Statistic } from "~/components/Stats/Statistic";
import { LogoButton } from "~/components/UI/buttons";
import { StandingsTable } from "~/components/UI/tables";
import { TitleWithSub } from "~/components/UI/titles";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelper";

type LeaguePageProps = {
  leagueId: string;
};

const League: NextPage<LeaguePageProps> = ({ leagueId }) => {
  const router = useRouter();
  const { data: league } = api.league.getLeagueInfo.useQuery({
    leagueId,
  });

  if (!league) return <div>Error while fetching league data</div>;

  return (
    <>
      <Head>
        <title>Score.gg</title>
        <meta name="description" content="Scoreboard application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex justify-between">
          <div className="max-w-fit">
            <TitleWithSub text="Standings" subtext="League player standings" />
            <StandingsTable players={league?.players} />
            <div className="ml-auto mt-2 flex gap-2">
              <LogoButton
                text="Manage players"
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm"
                onClick={() => router.push(`/players/${leagueId}`)}
              />
              <LogoButton
                text="Add Match"
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm"
              />
            </div>
          </div>
          <div className="max-w-fit">
            <TitleWithSub text="Stats" subtext="League statistics by player" />
            <div className="flex flex-wrap gap-2">
              <Statistic
                statName="Winrate"
                playerName="Jan Motak"
                score="74%"
              />
            </div>
          </div>
          <div className="max-w-fit">
            <TitleWithSub text="Matches" subtext="Latest matches played" />
            <div className="flex flex-col gap-2">
              <MatchInfo
                homePlayer="Jan Motak"
                homeScore={3}
                awayPlayer="Petr Pavel"
                awayScore={2}
              />
              <MatchInfo
                homePlayer="Jan Motak"
                homeScore={1}
                awayPlayer="Mike Smith"
                awayScore={2}
              />
              <MatchInfo
                homePlayer="Peter Johnes"
                homeScore={0}
                awayPlayer="Jan Motak"
                awayScore={2}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No slug");

  await ssg.league.getLeagueInfo.prefetch({ leagueId: slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      leagueId: slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default League;
