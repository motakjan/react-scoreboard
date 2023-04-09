/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Player } from "@prisma/client";
import type {
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type InputProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  error?: FieldError;
  type?: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  players: Player[] | undefined;
};

export const FormSelect: React.FC<InputProps> = ({
  label,
  name,
  error,
  register,
  registerOptions,
  players,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="name" className="text-sm">
        {label}
      </label>
      <select
        {...register(name, registerOptions)}
        className="rounded-md bg-neutral-800 px-3 py-2"
      >
        {players?.map((player) => (
          <option key={`homePlayer_${player.id}`} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>
      <span className="ml-[2px] h-5 py-1 text-xs text-red-600">
        {error?.message}
      </span>
    </div>
  );
};
