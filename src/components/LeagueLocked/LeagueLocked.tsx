import { useClerk } from "@clerk/nextjs";
import { type UserResource } from "@clerk/types";
import Link from "next/link";
import React from "react";
import { toast } from "react-hot-toast";
import { VscLock } from "react-icons/vsc";
import { api } from "~/utils/api";
import { LogoButton } from "../UI/buttons";

type LeagueLockedProps = {
  leagueId: string;
  user?: UserResource;
};

export const LeagueLocked: React.FC<LeagueLockedProps> = ({
  leagueId,
  user,
}) => {
  const { openSignIn } = useClerk();
  const { refetch } = api.league.sendEmailToOwner.useQuery(
    {
      leagueId: leagueId,
    },
    {
      enabled: false,
    }
  );

  const handleRequestClick = async () => {
    const { isSuccess } = await refetch();

    if (isSuccess) toast.success("Email to the owner has been sent");
  };

  return (
    <div className="absolute right-0 top-0 z-30 flex h-screen w-screen items-center justify-center bg-neutral-950/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl">League Locked</h1>
        <VscLock size={96} />
        <div className="flex gap-2">
          <LogoButton
            text={user ? "Request access" : "Sign in to request access"}
            className="flex items-center gap-2 rounded-md border-2 border-orange-500 px-4 py-2 text-xs hover:bg-orange-800/50"
            onClick={user ? handleRequestClick : openSignIn}
          />
          <Link href="/">
            <LogoButton
              text="Go back home"
              className="flex items-center gap-2 rounded-md border-2 border-blue-500 px-4 py-2 text-xs hover:bg-blue-800/50"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
