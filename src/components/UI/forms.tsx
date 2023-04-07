import type { Player } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { LogoButton } from "./buttons";

type PlayerFormProps = {
  onSubmit: SubmitHandler<PlayerValues>;
  isEditMode?: boolean;
  players?: Player[];
  editedPlayerId?: string;
};

type MatchFormProps = {
  onSubmit: SubmitHandler<MatchValues>;
  players?: Player[];
};

export type PlayerValues = {
  mmr: string;
  name: string;
  id?: string;
};

export type MatchValues = {
  homePlayerId: string;
  awayPlayerId: string;
  homeScore: number;
  awayScore: number;
  overtime: boolean;
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

export const MatchForm: React.FC<MatchFormProps> = ({ onSubmit, players }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MatchValues>();

  const handleFormSubmit: SubmitHandler<MatchValues> = (
    data: MatchValues,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();

    if (data.awayPlayerId === data.homePlayerId) {
      toast.error("Please pick different players");
      return;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Home Player</label>
        <select
          {...register("homePlayerId", { required: true })}
          className="rounded-md bg-neutral-800 px-3 py-2"
        >
          {players?.map((player) => (
            <option key={`homePlayer_${player.id}`} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        <span
          className={`ml-[2px] text-xs text-red-600 ${
            errors.homePlayerId ? "visible" : "invisible"
          }`}
        >
          This field is required
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name">Away Player</label>
        <select
          {...register("awayPlayerId", { required: true })}
          className="rounded-md bg-neutral-800 px-3 py-2"
        >
          {players?.map((player) => (
            <option key={`awayPlayer_${player.id}`} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        <span
          className={`ml-[2px] text-xs text-red-600 ${
            errors.awayPlayerId ? "visible" : "invisible"
          }`}
        >
          This field is required
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Home Player Score</label>
        <input
          type="number"
          placeholder="home player score"
          {...register("homeScore", { required: true, min: 0 })}
          className="rounded-md bg-neutral-800 px-3 py-2"
        />
        <span
          className={`ml-[2px] text-xs text-red-600 ${
            errors.homeScore ? "visible" : "invisible"
          }`}
        >
          This field is required
        </span>
        {errors.homeScore?.type === "min" && (
          <span
            className={`ml-[2px] text-xs text-red-600 ${
              errors.homeScore ? "visible" : "invisible"
            }`}
          >
            Score must be larger or equal to zero
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Away Player Score</label>
        <input
          type="number"
          placeholder="away player score"
          {...register("awayScore", { required: true, min: 0 })}
          className="rounded-md bg-neutral-800 px-3 py-2"
        />
        <span
          className={`ml-[2px] text-xs text-red-600 ${
            errors.awayScore ? "visible" : "invisible"
          }`}
        >
          This field is required
        </span>
        {errors.awayScore?.type === "min" && (
          <span
            className={`ml-[2px] text-xs text-red-600 ${
              errors.awayScore ? "visible" : "invisible"
            }`}
          >
            Score must be larger or equal to zero
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="mb-4 flex items-center">
          <input
            id="default-checkbox"
            type="checkbox"
            placeholder="Overtime"
            {...register("overtime", {})}
            value=""
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
          />
          <label
            htmlFor="default-checkbox"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Overtime/Shootout
          </label>
        </div>
      </div>
      <LogoButton
        text="Create Match"
        type="submit"
        className="ml-auto mt-4 w-28 rounded-md bg-red-600 px-2 py-2 text-sm"
      />
    </form>
  );
};
