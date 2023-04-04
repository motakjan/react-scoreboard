import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { Layout } from "~/components/Layout/Layout";
import { LogoButton } from "~/components/UI/buttons";
import { CreatePlayerForm } from "~/components/UI/forms";
import Modal from "~/components/UI/modals";
import { TitleWithSub } from "~/components/UI/titles";

const Players: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCreatePlayer = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>Score.gg</title>
        <meta name="description" content="Scoreboard application" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/images/bg.jpg" as="image" />
      </Head>
      <Layout>
        <TitleWithSub text="Players" subtext="Manage league players" />
        <div className="mb-4 grid grid-flow-row-dense grid-cols-3 gap-x-2 gap-y-3">
          <div className="bg-neutral-900 px-4 py-2">Jan Motak</div>
          <div className="bg-neutral-900 px-4 py-2">Jan Motak</div>
          <div className="bg-neutral-900 px-4 py-2">Jan Motak</div>
          <div className="bg-neutral-900 px-4 py-2">Jan Motak</div>
          <div className="bg-neutral-900 px-4 py-2">Jan Motak</div>
          <div className="bg-neutral-900 px-4 py-2">Jan Motak</div>
          <div className="bg-neutral-900 px-4 py-2">Jan Motak</div>
          <div className="bg-neutral-900 px-4 py-2">Jan Motak</div>
        </div>
        <LogoButton
          text="Add player"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm"
          onClick={() => setIsOpen(true)}
        />
        {isOpen && (
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <CreatePlayerForm onSubmit={handleCreatePlayer} />
          </Modal>
        )}
      </Layout>
    </>
  );
};

export default Players;
