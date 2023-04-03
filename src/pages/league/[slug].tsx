import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout } from "~/components/Layout/Layout";
import { MatchInfo } from "~/components/Matches/Match";
import { LogoButton } from "~/components/UI/buttons";
import { StandingsTable } from "~/components/UI/tables";
import { TitleWithSub } from "~/components/UI/titles";

const players = [
  "Jan Motak",
  "Pavel Martin",
  "Petr Pavel",
  "Pavel Martin",
  "Petr Pavel",
  "Pavel Martin",
  "Petr Pavel",
  "Pavel Martin",
  "Petr Pavel",
];

const League: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>Score.gg</title>
        <meta name="description" content="Scoreboard application" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/images/bg.jpg" as="image" />
      </Head>
      <Layout>
        <div className="flex justify-between">
          <div className="max-w-fit">
            <TitleWithSub text="Standings" subtext="League player standings" />
            <StandingsTable players={players} />
            <div className="ml-auto mt-2 flex gap-2">
              <LogoButton
                text="Manage players"
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm"
              />
              <LogoButton
                text="Create tournament"
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm"
              />
            </div>
          </div>
          <div className="max-w-fit">
            <TitleWithSub text="Stats" subtext="League statistics by player" />
            <div className="flex flex-wrap gap-2">
              <div className="flex w-48 flex-col items-center bg-neutral-900 px-4 py-2">
                <h1>Winrate</h1>
                <h2>Jan Motak</h2>
                <h2 className="text-bold text-3xl">74%</h2>
              </div>
              <div className="flex w-48  flex-col items-center bg-neutral-900 px-4 py-2">
                <h1>GPM</h1>
                <h2>Jan Motak</h2>
                <h2 className="text-bold text-3xl">4.3</h2>
              </div>
              <div className="flex w-48  flex-col items-center bg-neutral-900 px-4 py-2">
                <h1>GAPM</h1>
                <h2>Jan Motak</h2>
                <h2 className="text-bold text-3xl">0.22</h2>
              </div>
              <div className="flex  w-48 flex-col items-center bg-neutral-900 px-4 py-2">
                <h1>Longest streak</h1>
                <h2>Jan Motak</h2>
                <h2 className="text-bold text-3xl">8</h2>
              </div>
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

export default League;
