import React from "react";

type StatisticProps = {
  statName: string;
  playerName: string;
  score: string;
};

export const Statistic: React.FC<StatisticProps> = ({
  statName,
  playerName,
  score,
}) => {
  return (
    <div className="flex w-full flex-col bg-neutral-900 px-4 py-2 md:w-52">
      <h1>{statName}</h1>
      <h2>{playerName}</h2>
      <h2 className="text-3xl font-semibold text-blue-400">{score}</h2>
    </div>
  );
};
