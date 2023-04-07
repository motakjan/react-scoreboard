import { SignInButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscAdd, VscSignIn } from "react-icons/vsc";
import { ProfileSkeleton } from "~/components/UI/skeletons";
import { api } from "~/utils/api";
import { toSnakeCase } from "~/utils/toSnakeCase";
import { LogoButton } from "../components/UI/buttons";
import { Input } from "../components/UI/inputs";
import { Title } from "../components/UI/titles";

const Home: NextPage = () => {
  const [toastId, setToastId] = useState<string>("");
  const tournamentNameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { data: leagueWatchlist } = api.user.getUserWatchlist.useQuery();
  const createLeague = api.league.create.useMutation({
    onMutate() {
      const toastId = toast.loading("Processing request...");
      setToastId(toastId);
    },
    onSuccess: async (data) => {
      toast.success("Tournament successfully created", {
        id: toastId,
      });
      await router.push(`/league/${data.id}`);
    },
    onError: () => {
      toast.error("Error while creating tournament", {
        id: toastId,
      });
    },
    onSettled: () => {
      setToastId("");
    },
  });

  const handleCreateTournament = () => {
    const slug = toSnakeCase(tournamentNameRef.current?.value as string);

    if (user) createLeague.mutate({ slug });
  };

  return (
    <>
      <Head>
        <title>Score.gg</title>
        <meta name="description" content="Scoreboard application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-black bg-hero-pattern bg-cover bg-center">
        <div className="flex h-16 w-full justify-between bg-black/30 px-8 py-4 sm:px-16">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={100}
            height={30}
            loading="lazy"
          />
          {!isLoaded && <ProfileSkeleton />}
          {isSignedIn ? (
            <span className="flex items-center gap-2 font-medium text-white">
              <UserButton showName />
            </span>
          ) : (
            <>
              <SignInButton mode="modal">
                <LogoButton
                  text="Sign In"
                  icon={<VscSignIn size={20} />}
                  className="mr-2 inline-flex items-center gap-2 text-center text-sm font-medium text-white focus:outline-none"
                />
              </SignInButton>
            </>
          )}
        </div>
        <div className="flex flex-col gap-3 px-8 py-4 text-white sm:px-16">
          <Title text="Create a league" />
          <Input
            label="League name"
            prefix="SKRBRD.gg/"
            ref={tournamentNameRef}
          />
          <LogoButton
            text="Create a new league"
            icon={<VscAdd size={20} />}
            onClick={handleCreateTournament}
            className="mr-2 inline-flex w-fit items-center gap-2 rounded-md bg-blue-600  px-3 py-2 text-center text-sm font-medium text-white focus:outline-none"
            loading={!isLoaded}
            disabled={!isSignedIn || toastId !== ""}
          />
          <SignedIn>
            <div className="flex flex-col gap-1 pt-4">
              <h1>Watchlist</h1>
              {leagueWatchlist &&
                leagueWatchlist.map((item) => (
                  <Link
                    key={`watchlist_item_${item.id}`}
                    href={`/league/${item.id}`}
                    className="w-min bg-black/40 p-2 text-sm text-white hover:bg-black/80"
                  >
                    {item.slug}
                  </Link>
                ))}
            </div>
          </SignedIn>
        </div>
      </main>
    </>
  );
};
export default Home;
