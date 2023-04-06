import React from "react";
import { VscEdit, VscTrash } from "react-icons/vsc";
import { IconButton } from "../UI/buttons";

type PlayerListItemProps = {
  name: string;
  mmr: number;
  onEdit: (playerId: string) => void;
  onDelete: (playerId: string) => void;
  id: string;
};

export const PlayerListItem: React.FC<PlayerListItemProps> = ({
  id,
  name,
  mmr,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2">
      {name}
      <span className="text-xs text-neutral-600">({mmr})</span>
      <span className="ml-auto flex gap-1">
        <IconButton icon={<VscEdit size={16} />} onClick={() => onEdit(id)} />
        <IconButton
          icon={<VscTrash size={16} className="text-red-500" />}
          onClick={() => onDelete(id)}
        />
      </span>
    </div>
  );
};
