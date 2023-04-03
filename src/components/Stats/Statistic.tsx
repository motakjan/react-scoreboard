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
    <div className="flex w-48 flex-col items-center bg-neutral-900 px-4 py-2">
      <h1>{statName}</h1>
      <h2>{playerName}</h2>
      <h2 className="text-bold text-3xl">{score}</h2>
    </div>
  );
};
