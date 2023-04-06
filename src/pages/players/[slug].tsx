import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { VscEdit, VscTrash } from "react-icons/vsc";
import { Layout } from "~/components/Layout/Layout";
import { IconButton, LogoButton } from "~/components/UI/buttons";
import { PlayerForm, type PlayerValues } from "~/components/UI/forms";
import Modal from "~/components/UI/modals";
import { TitleWithSub } from "~/components/UI/titles";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelper";

type PlayersPageProps = {
  leagueId: string;
};

const PlayersPage: NextPage<PlayersPageProps> = ({ leagueId }) => {
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [toastId, setToastId] = useState<string>("");
  const [editedPlayerId, setEditedPlayerId] = useState<string>("");
  const ctx = api.useContext();

  const updatePlayer = api.player.update.useMutation({
    onMutate() {
      const toastId = toast.loading("Updating a player...");
      setToastId(toastId);
    },
    onSuccess: () => {
      toast.success("Player successfully updated", {
        id: toastId,
      });
      void ctx.player.getPlayersByLeagueId.invalidate();
      setIsPlayerModalOpen(false);
    },
    onError: () => {
      toast.error("Error while updating player", {
        id: toastId,
      });
    },
    onSettled: () => {
      setToastId("");
    },
  });

  const createPlayer = api.player.create.useMutation({
    onMutate() {
      const toastId = toast.loading("Creating a new player...");
      setToastId(toastId);
    },
    onSuccess: () => {
      toast.success("New player created", {
        id: toastId,
      });
      void ctx.player.getPlayersByLeagueId.invalidate();
      setIsPlayerModalOpen(false);
    },
    onError: () => {
      toast.error("Error while creating a new player", {
        id: toastId,
      });
    },
    onSettled: () => {
      setToastId("");
    },
  });

  const deletePlayer = api.player.delete.useMutation({
    onMutate() {
      const toastId = toast.loading("Deleting a player...");
      setToastId(toastId);
    },
    onSuccess: () => {
      toast.success("Player deleted", {
        id: toastId,
      });
      void ctx.player.getPlayersByLeagueId.invalidate();
    },
    onError: () => {
      toast.error("Error while deleting a player", {
        id: toastId,
      });
    },
    onSettled: () => {
      setToastId("");
    },
  });

  const { data: players } = api.player.getPlayersByLeagueId.useQuery({
    leagueId,
  });

  if (!players) return <div>Error while creating this page...</div>;

  const handleCreatePlayer = (playerData: PlayerValues) => {
    createPlayer.mutate({
      leagueId,
      name: playerData.name,
      mmr: parseInt(playerData.mmr),
    });
  };

  const handleUpdatePlayer = (playerData: PlayerValues) => {
    if (!playerData.id) {
      toast.error("Error while updating player");
      return;
    }

    updatePlayer.mutate({
      id: playerData.id,
      mmr: +playerData.mmr,
      name: playerData.name,
    });
  };

  const handleDeletePlayer = (playerId: string) => {
    deletePlayer.mutate({ id: playerId });
  };

  const handleEditPlayerClick = (playerId: string) => {
    setIsPlayerModalOpen(true);
    setEditedPlayerId(playerId);
  };

  const handleAddPlayerClick = () => {
    setEditedPlayerId("");
    setIsPlayerModalOpen(true);
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
              <span className="ml-auto flex gap-1">
                <IconButton
                  icon={<VscEdit size={16} />}
                  onClick={() => handleEditPlayerClick(player.id)}
                />
                <IconButton
                  icon={<VscTrash size={16} className="text-red-500" />}
                  onClick={() => handleDeletePlayer(player.id)}
                />
              </span>
            </div>
          ))}
        </div>
        <LogoButton
          text="Add player"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm"
          onClick={() => handleAddPlayerClick()}
        />
        {isPlayerModalOpen && (
          <Modal
            isOpen={isPlayerModalOpen}
            onClose={() => setIsPlayerModalOpen(false)}
            title={editedPlayerId === "" ? "Create new player" : "Edit player"}
          >
            {editedPlayerId === "" ? (
              <PlayerForm onSubmit={handleCreatePlayer} />
            ) : (
              <PlayerForm
                onSubmit={handleUpdatePlayer}
                players={players}
                editedPlayerId={editedPlayerId}
                isEditMode
              />
            )}
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
