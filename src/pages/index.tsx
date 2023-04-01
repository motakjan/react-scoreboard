import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import Image from "next/image";
import { VscAdd, VscSignIn } from "react-icons/vsc";
import { api } from "~/utils/api";
import { LogoButton } from "../components/UI/buttons";
import { Input } from "../components/UI/inputs";
import { Title } from "../components/UI/titles";

const Home: NextPage = () => {
  const [tournamentName, setTournamentName] = useState<string>();
  const _hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { user, isSignedIn } = useUser();

  console.log({ _hello, tournamentName });

  const handleLeagueNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setTournamentName(value);
  };

  return (
    <>
      <Head>
        <title>Score.gg</title>
        <meta name="description" content="Scoreboard application" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/images/bg.jpg" as="image" />
      </Head>
      <main className="flex min-h-screen flex-col bg-hero-pattern bg-cover bg-center">
        <div className="flex h-16 w-full justify-between bg-black bg-opacity-25 px-8 py-4">
          <Image src="/images/logo.svg" alt="logo" width={100} height={30} />
          {isSignedIn ? (
            <span className="flex items-center gap-2 font-medium text-white">
              {user && user.username}
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
        </div>
        <div className="flex flex-col gap-3 px-8 py-2 text-white">
          <Title text="Create a league" />
          <Input
            label="League name"
            prefix="score.gg/"
            onChange={handleLeagueNameChange}
          />
          <LogoButton
            text="Create a new league"
            icon={<VscAdd size={20} />}
            className="mr-2 inline-flex w-fit items-center gap-2 rounded-md bg-red-600  px-3 py-2 text-center text-sm font-medium text-white focus:outline-none"
          />
        </div>
      </main>
    </>
  );
};

export default Home;
