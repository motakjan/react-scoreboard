import type { Player } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { LogoButton } from "./buttons";

type PlayerFormProps = {
  onSubmit: SubmitHandler<PlayerValues>;
  isEditMode?: boolean;
  players?: Player[];
  editedPlayerId?: string;
};

export type PlayerValues = {
  mmr: string;
  name: string;
  id?: string;
};

export const PlayerForm: React.FC<PlayerFormProps> = ({
  onSubmit,
  players,
  editedPlayerId,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlayerValues>();

  const handleFormSubmit: SubmitHandler<PlayerValues> = (
    data: PlayerValues,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    onSubmit({ ...data, id: player?.id });
  };

  const player = players?.find((player) => player.id === editedPlayerId);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Name</label>
        <input
          className="rounded-md bg-neutral-800 px-3 py-2"
          type="text"
          defaultValue={isEditMode ? player?.name : ""}
          placeholder="players first and last name"
          {...register("name", { required: true })}
        />
        <span
          className={`ml-[2px] text-xs text-red-600 ${
            errors.name ? "visible" : "invisible"
          }`}
        >
          This field is required
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="mmr">MMR</label>
        <input
          className="rounded-md bg-neutral-800 px-3 py-2"
          type="number"
          defaultValue={isEditMode ? player?.mmr : 1000}
          placeholder="player mmr (default 1000)"
          {...register("mmr", { required: true, min: 0, max: 8000 })}
        />
        {errors.mmr?.type === "required" && (
          <span
            className={`ml-[2px] text-xs text-red-600 ${
              errors.mmr ? "visible" : "invisible"
            }`}
          >
            This field is required
          </span>
        )}
        {errors.mmr?.type === "min" && (
          <span
            className={`ml-[2px] text-xs text-red-600 ${
              errors.mmr ? "visible" : "invisible"
            }`}
          >
            MMR must be greater than or equal to 0
          </span>
        )}
        {errors.mmr?.type === "max" && (
          <span
            className={`ml-[2px] text-xs text-red-600 ${
              errors.mmr ? "visible" : "invisible"
            }`}
          >
            MMR must be less than or equal to 8000
          </span>
        )}
      </div>

      <LogoButton
        text={isEditMode ? "Update player" : "Create player"}
        type="submit"
        className="ml-auto mt-4 w-28 rounded-md bg-red-600 px-2 py-2 text-sm"
      />
    </form>
  );
};
