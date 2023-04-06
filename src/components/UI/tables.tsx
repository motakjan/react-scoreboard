import { type Player } from "@prisma/client";
import React from "react";

type StandingsTableProps = {
  players: Player[];
};

export const StandingsTable: React.FC<StandingsTableProps> = ({ players }) => {
  return (
    <div className="relative max-w-[35rem] overflow-x-auto rounded-md">
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
            <th scope="col" className="px-6 py-3">
              Score
            </th>
            <th scope="col" className="px-6 py-3">
              MMR
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={`standings_${player.id}`}
              className="border-b bg-white dark:border-neutral-900 dark:bg-neutral-800"
            >
              <td className="px-6 py-2">1</td>
              <th
                scope="row"
                className="flex gap-2 whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
              >
                {player.name}
              </th>
              <td className="px-6 py-2">10/5/2/1</td>
              <td className="px-6 py-2">50-18</td>
              <td className="text-ellipsis-white px-6 py-2 font-semibold text-white">
                {player.mmr}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
