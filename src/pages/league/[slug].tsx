import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>Score.gg</title>
        <meta name="description" content="Scoreboard application" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/images/bg.jpg" as="image" />
      </Head>
      <main className="flex min-h-screen text-black">{slug}</main>
    </>
  );
};

export default Home;
