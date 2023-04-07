import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

export const useMatchMutations = () => {
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

  const createMatch = api.match.create.useMutation({
    ...commonOptions,
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

  return { createMatch };
};
