import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

export const usePlayerMutations = () => {
  const ctx = api.useContext();
  const [toastId, setToastId] = useState<string>("");

  const commonOptions = {
    onMutate() {
      const toastId = toast.loading("Processing request...");
      setToastId(toastId);
    },
    onSettled: () => {
      setToastId("");
    },
  };

  const updatePlayer = api.player.update.useMutation({
    ...commonOptions,
    onSuccess: () => {
      toast.success("Player successfully updated", {
        id: toastId,
      });
      void ctx.player.getPlayersByLeagueId.invalidate();
    },
    onError: () => {
      toast.error("Error while updating player", {
        id: toastId,
      });
    },
  });

  const createPlayer = api.player.create.useMutation({
    ...commonOptions,
    onSuccess: () => {
      toast.success("New player created", {
        id: toastId,
      });
      void ctx.player.getPlayersByLeagueId.invalidate();
    },
    onError: () => {
      toast.error("Error while creating a new player", {
        id: toastId,
      });
    },
  });

  const deletePlayer = api.player.delete.useMutation({
    ...commonOptions,
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
  });

  return { updatePlayer, createPlayer, deletePlayer };
};
