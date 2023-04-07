import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Layout } from "~/components/Layout/Layout";
import { MatchInfo } from "~/components/Matches/Match";
import { Statistic } from "~/components/Stats/Statistic";
import { LogoButton } from "~/components/UI/buttons";
import { MatchForm, type MatchValues } from "~/components/UI/forms";
import Modal from "~/components/UI/modals";
import { StandingsTable } from "~/components/UI/tables";
import { TitleWithSub } from "~/components/UI/titles";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelper";

type LeaguePageProps = {
  leagueId: string;
};

const League: NextPage<LeaguePageProps> = ({ leagueId }) => {
  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);
  const [toastId, setToastId] = useState<string>("");
  const ctx = api.useContext();
  const router = useRouter();
  const createMatch = api.match.create.useMutation({
    onMutate() {
      const toastId = toast.loading("Processing request...");
      setToastId(toastId);
    },
    onSettled: () => {
      setToastId("");
    },
    onSuccess: () => {
      toast.success("New match created", {
        id: toastId,
      });
      void ctx.league.getLeagueInfo.invalidate();
    },
    onError: () => {
      toast.error("Error while creating a new match", {
        id: toastId,
      });
    },
  });
  const { data: league } = api.league.getLeagueInfo.useQuery({
    leagueId,
  });

  if (!league) return <div>Error while fetching league data</div>;

  const handleCreateMatch = (matchData: MatchValues) => {
    createMatch.mutate({
      ...matchData,
      homeScore: +matchData.homeScore,
      awayScore: +matchData.awayScore,
      leagueId,
    });
    setIsMatchModalOpen(false);
  };

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
                onClick={() => setIsMatchModalOpen(true)}
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
              {league.matches.slice(0, 5).map((match) => (
                <MatchInfo
                  key={`match_${match.id}`}
                  homePlayer={match.homePlayer.name}
                  homeScore={match.homeScore}
                  awayPlayer={match.awayPlayer.name}
                  awayScore={match.awayScore}
                  overtime={match.overtime}
                />
              ))}
              <Link
                href={`/matches/${leagueId}`}
                className="text-sm text-blue-600 hover:underline"
              >
                For more results visit match history page
              </Link>
            </div>
          </div>
        </div>
        {isMatchModalOpen && (
          <Modal
            isOpen={isMatchModalOpen}
            onClose={() => setIsMatchModalOpen(false)}
            title="Add Match"
          >
            <MatchForm onSubmit={handleCreateMatch} players={league.players} />
          </Modal>
        )}
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
