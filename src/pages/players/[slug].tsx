import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { VscEdit } from "react-icons/vsc";
import { Layout } from "~/components/Layout/Layout";
import { IconButton, LogoButton } from "~/components/UI/buttons";
import {
  CreatePlayerForm,
  type CreatePlayerValues,
} from "~/components/UI/forms";
import Modal from "~/components/UI/modals";
import { TitleWithSub } from "~/components/UI/titles";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelper";

type PlayersPageProps = {
  leagueId: string;
};

const PlayersPage: NextPage<PlayersPageProps> = ({ leagueId }) => {
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState<boolean>(false);
  const [creatingToastId, setCreatingToastId] = useState<string>("");
  const ctx = api.useContext();
  const createPlayer = api.player.create.useMutation({
    onMutate() {
      const toastId = toast.loading("Creating a new player...");
      setCreatingToastId(toastId);
    },
    onSuccess: () => {
      toast.success("New player created", {
        id: creatingToastId,
      });
      void ctx.player.getPlayersByLeagueId.invalidate();
      setIsAddPlayerOpen(false);
    },
    onError: () => {
      toast.error("Error while creating a new player", {
        id: creatingToastId,
      });
    },
    onSettled: () => {
      setCreatingToastId("");
    },
  });

  const { data: players } = api.player.getPlayersByLeagueId.useQuery({
    leagueId,
  });

  if (!players) return <div>Error while creating this page...</div>;

  const handleCreatePlayer = (playerData: CreatePlayerValues) => {
    createPlayer.mutate({
      leagueId,
      name: playerData.name,
      mmr: parseInt(playerData.mmr),
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
        <TitleWithSub text="Players" subtext="Manage league players" />
        <div className="mb-4 grid grid-flow-row-dense grid-cols-1 gap-x-2 gap-y-3 md:grid-cols-2 lg:grid-cols-4">
          {players?.map((player) => (
            <div
              key={`player_card_${player.id}`}
              className="flex items-center gap-2 bg-neutral-900 px-4 py-2"
            >
              {player.name}
              <span className="text-xs text-neutral-600">({player.mmr})</span>
              <IconButton
                icon={<VscEdit size={14} />}
                className="ml-auto"
                onClick={() => console.log("click")}
              />
            </div>
          ))}
        </div>
        <LogoButton
          text="Add player"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm"
          onClick={() => setIsAddPlayerOpen(true)}
        />
        {isAddPlayerOpen && (
          <Modal
            isOpen={isAddPlayerOpen}
            onClose={() => setIsAddPlayerOpen(false)}
            title="Create new player"
          >
            <CreatePlayerForm onSubmit={handleCreatePlayer} />
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

  await ssg.player.getPlayersByLeagueId.prefetch({ leagueId: slug });

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

export default PlayersPage;
