import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout } from "~/components/Layout/Layout";
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
            <TitleWithSub text="Matches" subtext="Latest matches played" />
            <div className="flex flex-col gap-2">
              <div className="flex w-96 flex-col gap-2 rounded-md bg-neutral-900 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h1>Jan Motak</h1>
                    <h2 className="text-sm">Home</h2>
                  </div>

                  <h1 className="text-4xl">4</h1>
                </div>
                <div className="flex items-center justify-between text-neutral-500">
                  <div>
                    <h1>Petr Pavel</h1>
                    <h2 className="text-sm">Away</h2>
                  </div>

                  <h1 className="text-4xl">0</h1>
                </div>
              </div>
              <div className="flex w-96 flex-col gap-2 rounded-md bg-neutral-900 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h1>Jan Motak</h1>
                    <h2 className="text-sm">Home</h2>
                  </div>

                  <h1 className="text-4xl">2</h1>
                </div>
                <div className="flex items-center justify-between text-neutral-500">
                  <div>
                    <h1>Petr Pavel</h1>
                    <h2 className="text-sm">Away</h2>
                  </div>

                  <h1 className="text-4xl">1</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default League;
