import { type Player } from "@prisma/client";
import { PlayerListItem } from "./PlayerListItem";

type PlayerListProps = {
  players: Player[];
  onEdit: (playerId: string) => void;
  onDelete: (playerId: string) => void;
};

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  onEdit,
  onDelete,
}) => (
  <div className="mb-4 grid grid-flow-row-dense grid-cols-1 gap-x-2 gap-y-3 md:grid-cols-2 lg:grid-cols-4">
    {players?.map((player) => (
      <PlayerListItem
        key={`player_card_${player.id}`}
        id={player.id}
        name={player.name}
        mmr={player.mmr}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);
