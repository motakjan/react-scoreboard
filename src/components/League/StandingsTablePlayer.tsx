import React from "react";
import { type PlayerWithMatches } from "~/types/leagueTypes";
import { getPlayerScore } from "~/utils/scoreCalculation";

type StandingsTablePlayerProps = {
  player: PlayerWithMatches;
  placement: number;
};

export const StandingsTablePlayer: React.FC<StandingsTablePlayerProps> = ({
  player,
  placement,
}) => {
  const [
    goalsScored,
    goalsScoredAgainst,
    regularWins,
    otWins,
    regularLosses,
    otLoses,
  ] = getPlayerScore(player);

  return (
    <tr
      key={`standings_${player.id}`}
      className="border-b bg-white dark:border-neutral-900 dark:bg-neutral-800"
    >
      <td className="px-6 py-2">{placement + 1}</td>
      <th
        scope="row"
        className="flex gap-2 whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
      >
        {player.name}
      </th>
      <td className="px-6 py-2">
        {regularWins}-{otWins}-{otLoses}-{regularLosses}
      </td>
      <td className="px-6 py-2">
        {goalsScored}-{goalsScoredAgainst}
      </td>
      <td className="text-ellipsis-white px-6 py-2 font-semibold text-white">
        {player.mmr}
      </td>
    </tr>
  );
};
