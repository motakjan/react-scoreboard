import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Layout } from "~/components/Layout/Layout";
import { PlayerList } from "~/components/Players/PlayersList";
import { LogoButton } from "~/components/UI/buttons";
import { PlayerForm, type PlayerValues } from "~/components/UI/forms";
import Modal from "~/components/UI/modals";
import { TitleWithSub } from "~/components/UI/titles";
import { usePlayerMutations } from "~/hooks/usePlayerMutations";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelper";

type PlayersPageProps = {
  leagueId: string;
};

const PlayersPage: NextPage<PlayersPageProps> = ({ leagueId }) => {
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [editedPlayerId, setEditedPlayerId] = useState<string>("");
  const [deletedPlayerIds, setDeletedPlayerIds] = useState<string[]>([]);
  const { updatePlayer, createPlayer, deletePlayer } = usePlayerMutations();

  const { data: players } = api.player.getPlayersByLeagueId.useQuery({
    leagueId,
  });

  if (!players) return <div>Error while creating this page...</div>;

  const handleCreateOrUpdatePlayer = (playerData: PlayerValues) => {
    if (editedPlayerId) {
      handleUpdatePlayer(playerData);
    } else {
      handleCreatePlayer(playerData);
    }

    setIsPlayerModalOpen(false);
  };

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
    setDeletedPlayerIds((prevUsers) => [...prevUsers, playerId]);
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
        <PlayerList
          players={players}
          onEdit={handleEditPlayerClick}
          onDelete={handleDeletePlayer}
          deletedPlayerIds={deletedPlayerIds}
        />
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
            <PlayerForm
              onSubmit={handleCreateOrUpdatePlayer}
              players={players}
              editedPlayerId={editedPlayerId}
              isEditMode={Boolean(editedPlayerId)}
            />
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
