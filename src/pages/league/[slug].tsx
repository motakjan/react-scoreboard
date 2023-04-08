import { SignedIn, useUser } from "@clerk/nextjs";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { RiPlayListAddLine } from "react-icons/ri";
import { Layout } from "~/components/Layout/Layout";
import { MatchInfo } from "~/components/Matches/Match";
import { Statistic } from "~/components/Stats/Statistic";
import { LogoButton } from "~/components/UI/buttons";
import { MatchForm, type MatchValues } from "~/components/UI/forms";
import Modal from "~/components/UI/modals";
import { StandingsTable } from "~/components/UI/tables";
import { TitleWithSub } from "~/components/UI/titles";
import { useMatchMutations } from "~/hooks/useMatchMutations";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelper";
import { snakeToNormal } from "~/utils/toSnakeCase";

type LeaguePageProps = {
  leagueId: string;
};

const League: NextPage<LeaguePageProps> = ({ leagueId }) => {
  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);
  const [userWatchlist, setUserWatchlist] = useState<string[] | null>(null);
  const [toastId, setToastId] = useState<string>("");
  const { createMatch } = useMatchMutations();
  const { user } = useUser();
  const router = useRouter();
  const { data: { league, stats, watchlist } = {} } =
    api.league.getLeagueInfo.useQuery({
      leagueId,
    });

  const setWatchlist = api.user.setWatchlist.useMutation({
    onMutate() {
      const toastId = toast.loading("Processing request...");
      setToastId(toastId);
    },
    onSettled: () => {
      setToastId("");
    },
    onSuccess: (data) => {
      toast.success("Watchlist edited", {
        id: toastId,
      });
      setUserWatchlist(data);
    },
    onError: () => {
      toast.error("Error while editing watchlist", {
        id: toastId,
      });
    },
  });

  useEffect(() => {
    if (Array.isArray(watchlist)) {
      setUserWatchlist((prevWatchlist) => watchlist || prevWatchlist);
    }
  }, [watchlist]);

  if (!league || !stats) return <div>Error while fetching league data</div>;

  const handleCreateMatch = (matchData: MatchValues) => {
    createMatch.mutate({
      ...matchData,
      homeScore: +matchData.homeScore,
      awayScore: +matchData.awayScore,
      leagueId,
    });
    setIsMatchModalOpen(false);
  };

  const handleWatchLeague = () => {
    if (!user) return;
    setWatchlist.mutate({
      userId: user.id,
      leagues: userWatchlist ? [...userWatchlist, leagueId] : [leagueId],
    });
  };

  const handleUnwatchLeague = () => {
    if (!user) return;
    setWatchlist.mutate({
      userId: user.id,
      leagues: userWatchlist
        ? userWatchlist.filter((league) => league !== leagueId)
        : [],
    });
  };

  return (
    <>
      <Head>
        <title>Score.gg</title>
        <meta name="description" content="Scoreboard application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="mb-2 flex items-center gap-4">
          <h1 className="text-2xl font-semibold">
            {snakeToNormal(league.slug)}
          </h1>
          {watchlist && (
            <SignedIn>
              {userWatchlist?.includes(league.id) ? (
                <LogoButton
                  text="UNWATCH"
                  icon={<RiPlayListAddLine size={14} />}
                  className="flex items-center gap-2 rounded-full border-2 border-red-700 bg-red-600/20 px-4 py-1 text-xs hover:bg-red-600/40"
                  onClick={handleUnwatchLeague}
                />
              ) : (
                <LogoButton
                  text="WATCH"
                  icon={<RiPlayListAddLine size={14} />}
                  className="flex items-center gap-2 rounded-full border-2 border-blue-700 bg-blue-600/20 px-4 py-1 text-xs hover:bg-blue-600/40"
                  onClick={handleWatchLeague}
                />
              )}
            </SignedIn>
          )}
        </div>

        <div className="flex flex-col justify-between xl:flex-row">
          <div className="py-2 lg:pr-4">
            <TitleWithSub text="Standings" subtext="League player standings" />
            <StandingsTable players={league.players} />
            <div className="ml-auto mt-2 flex gap-2">
              <SignedIn>
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
              </SignedIn>
            </div>
          </div>
          <div className="py-2 lg:px-4">
            <TitleWithSub text="Stats" subtext="League statistics by player" />
            <div className="flex flex-wrap gap-2">
              {stats.length > 0 ? (
                stats.map((stat) => (
                  <Statistic
                    key={`${stat.name}`}
                    statName={stat.name}
                    playerName={stat.player?.name || ""}
                    score={stat.stat}
                  />
                ))
              ) : (
                <div className="text-sm text-neutral-200">
                  No data yet at least one player has to play more than three
                  matches for stats to show
                </div>
              )}
            </div>
          </div>
          <div className="py-2 md:w-96 lg:px-4">
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
