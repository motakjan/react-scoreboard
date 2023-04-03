import React from "react";

type MatchInfoProps = {
  homePlayer: string;
  awayPlayer: string;
  homeScore: number;
  awayScore: number;
};

export const MatchInfo: React.FC<MatchInfoProps> = ({
  homePlayer,
  awayPlayer,
  homeScore,
  awayScore,
}) => {
  const hasHomeWon = homeScore > awayScore;

  return (
    <div className="flex w-96 flex-col gap-2 rounded-md bg-neutral-900 px-4 py-2">
      <div
        className={`flex items-center justify-between ${
          hasHomeWon ? "" : "text-neutral-500"
        }`}
      >
        <div>
          <h1>{homePlayer}</h1>
          <h2 className="text-sm">Home</h2>
        </div>

        <h1 className="text-4xl">{homeScore}</h1>
      </div>
      <div
        className={`flex items-center justify-between ${
          hasHomeWon ? "text-neutral-500" : ""
        }`}
      >
        <div>
          <h1>{awayPlayer}</h1>
          <h2 className="text-sm">Away</h2>
        </div>

        <h1 className="text-4xl">{awayScore}</h1>
      </div>
    </div>
  );
};
