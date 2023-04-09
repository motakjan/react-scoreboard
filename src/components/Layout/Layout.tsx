import { useUser } from "@clerk/nextjs";
import { type League } from "@prisma/client";
import React, { type ReactNode } from "react";
import { LeagueLocked } from "../LeagueLocked/LeagueLocked";
import Navbar from "../Navbar/Navbar";
import { LoadingPage } from "../UI/loading";

export type LayoutProps = {
  children?: ReactNode | undefined;
  league: League;
  allowedUsers: string[];
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  league,
  allowedUsers,
}) => {
  const { user, isLoaded } = useUser();

  const isAllowed =
    (league.isPrivate && !user) ||
    (league.isPrivate && user && !allowedUsers.includes(user?.id));

  return (
    <main className="flex min-h-screen flex-col bg-layout text-white">
      <Navbar />
      {!isLoaded && <LoadingPage />}
      {isLoaded && isAllowed ? (
        <LeagueLocked leagueId={league.id} user={user || undefined} />
      ) : (
        <div className="px-8 pt-8 sm:px-16">{children}</div>
      )}
    </main>
  );
};
