import {
  SignInButton,
  SignedIn,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import { useClickOutside } from "@mantine/hooks";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { VscLock, VscSignIn } from "react-icons/vsc";
import { CreateLeagueForm } from "~/components/UI/forms";
import Modal from "~/components/UI/modals";
import { ProfileSkeleton } from "~/components/UI/skeletons";
import useDebounce from "~/hooks/useDebounce";
import { type CreateLeagueValues } from "~/types/formTypes";
import { api } from "~/utils/api";
import { toSnakeCase } from "~/utils/toSnakeCase";
import { LogoButton } from "../components/UI/buttons";

const Home: NextPage = () => {
  const [toastId, setToastId] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const debouncedSearchValue = useDebounce<string>(searchValue, 500);
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const searchRef = useClickOutside(() => setIsSearchOpen(false));
  const { data: leagueWatchlist } = api.user.getUserWatchlist.useQuery();
  const { data: resLeagues, refetch } = api.league.getLeaguesByQuery.useQuery(
    {
      query: debouncedSearchValue,
    },
    {
      enabled: debouncedSearchValue !== "",
    }
  );
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

  useEffect(() => {
    if (debouncedSearchValue !== "") {
      void refetch();
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, [debouncedSearchValue, refetch]);

  const handleCreateLeague = (leagueData: CreateLeagueValues) => {
    const slug = toSnakeCase(leagueData.leagueName);
    if (user)
      createLeague.mutate({
        slug,
        isPrivate: leagueData.isPrivate,
        name: leagueData.leagueName,
      });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Score.gg</title>
        <meta name="description" content="Scoreboard application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-200/80 via-slate-100 to-blue-200/90">
        <nav className="absolute flex h-16 w-full justify-between bg-black/90 px-8 py-4 sm:px-16">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={100}
            height={30}
            loading="eager"
          />
          <span className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                className="w-48 rounded-md border-2 border-neutral-950/50 bg-neutral-900 px-2 py-1 text-white focus:border-blue-500 focus:outline-none"
                placeholder="lookup league"
                value={searchValue}
                autoComplete="off"
                onChange={handleSearchChange}
              />
              <div
                ref={searchRef}
                className="absolute top-10 w-48 rounded-md bg-neutral-900 text-sm text-white"
              >
                {isSearchOpen &&
                  resLeagues?.map((league) => (
                    <Link
                      key={`search_${league.id}`}
                      href={`/league/${league.id}`}
                    >
                      <div className="flex items-center justify-between break-all rounded-md px-2 py-1 hover:cursor-pointer hover:bg-neutral-800">
                        <div className="w-4/5">{league.name}</div>

                        {league.isPrivate && <VscLock size={12} />}
                      </div>
                    </Link>
                  ))}
                {resLeagues?.length === 0 && (
                  <div className="flex items-center justify-between break-all rounded-md px-2 py-1 text-gray-400">
                    No results for your query
                  </div>
                )}
              </div>
            </div>

            {!isLoaded && <ProfileSkeleton />}
            {isSignedIn ? (
              <span className="flex items-center gap-2 font-medium text-white">
                <UserButton />
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
          </span>
        </nav>
        <div className="flex h-screen w-screen flex-col items-start justify-center text-black">
          <div className="flex flex-col gap-8 px-16">
            <h1 className="font-['Manrope'] text-4xl font-extrabold md:text-6xl">
              LET YOUR TOURNAMENT <br />
              <span className="text-blue-600">JORNEY BEGIN</span>
            </h1>
            <p className="max-w-lg font-semibold text-slate-600">
              Create your own gaming league, track player MMR, and organize
              tournaments with ease on our platform.With our user-friendly
              interface and advanced features, you will have everything you need
              to create a fun and competitive gaming community. <br />
              Sign up now to get started.
            </p>
            <LogoButton
              text={isSignedIn ? "Start a new league" : "Sign in to start"}
              onClick={
                isSignedIn ? () => setIsCreateModalOpen(true) : openSignIn
              }
              className="text-md mr-2 inline-flex w-fit items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-center font-semibold text-white focus:outline-none"
              loading={!isLoaded}
            />
          </div>
        </div>
        {isCreateModalOpen && (
          <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            title="Create league"
          >
            <CreateLeagueForm onSubmit={handleCreateLeague} />
          </Modal>
        )}
        {false && (
          <SignedIn>
            <div className="flex flex-col gap-1 pt-4">
              <h1>Watchlist</h1>
              {leagueWatchlist &&
                leagueWatchlist?.map((item) => (
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
        )}
      </main>
    </>
  );
};
export default Home;
