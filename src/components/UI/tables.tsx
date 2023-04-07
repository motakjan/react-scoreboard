import React from "react";
import { type PlayerWithMatches } from "~/types/leagueTypes";
import { StandingsTablePlayer } from "../League/StandingsTablePlayer";

type StandingsTableProps = {
  players: PlayerWithMatches[];
};

export const StandingsTable: React.FC<StandingsTableProps> = ({ players }) => {
  return (
    <div className="relative max-w-[36rem] overflow-x-auto rounded-md">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-neutral-900 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Place
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              W/OTW/OTL/L
            </th>
            <th scope="col" className="px-8 py-3">
              Score
            </th>
            <th scope="col" className="px-6 py-3">
              MMR
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <StandingsTablePlayer
              key={`standing_player_${player.id}`}
              player={player}
              placement={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
