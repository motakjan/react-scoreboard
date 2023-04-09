import type { Player } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import type {
  CreateLeagueValues,
  MatchValues,
  PlayerValues,
} from "~/types/formTypes";
import { FormCheck } from "../FormInputs/FormCheck";
import { FormInput } from "../FormInputs/FormInput";
import { FormSelect } from "../FormInputs/FormSelect";
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

type CreateLeagueFormProps = {
  onSubmit: SubmitHandler<CreateLeagueValues>;
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
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-1"
    >
      <FormInput
        label="Name"
        name="name"
        placeholder="player name"
        error={errors?.name}
        register={register}
        registerOptions={{
          required: { value: true, message: "MMR is required" },
        }}
      />
      <FormInput
        label="MMR"
        name="mmr"
        placeholder="player mmr"
        error={errors?.mmr}
        defaultValue={1000}
        type="number"
        register={register}
        registerOptions={{
          required: { value: true, message: "MMR is required" },
          min: { value: 1, message: "MMR must be greater than or equal to 1" },
          max: {
            value: 10000,
            message: "MMR must be lesser or equal than 10000",
          },
        }}
      />
      <LogoButton
        text={isEditMode ? "Update player" : "Create player"}
        type="submit"
        className="ml-auto mt-4 w-28 rounded-md bg-blue-600 px-2 py-2 text-sm"
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
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-1"
    >
      <FormSelect
        label="Home Player"
        name="homePlayerId"
        error={errors?.homePlayerId}
        register={register}
        registerOptions={{
          required: { value: true, message: "Home player is required" },
        }}
        players={players}
      />
      <FormSelect
        label="Away Player"
        name="awayPlayerId"
        error={errors?.awayPlayerId}
        register={register}
        registerOptions={{
          required: { value: true, message: "Away player is required" },
        }}
        players={players}
      />
      <FormInput
        label="Home Player Score"
        name="homeScore"
        placeholder="home player score"
        error={errors?.homeScore}
        type="number"
        register={register}
        registerOptions={{
          required: { value: true, message: "Home score is required" },
          min: { value: 0, message: "Home score has to be larger then 0" },
        }}
      />
      <FormInput
        label="Away Player Score"
        name="awayScore"
        placeholder="away player score"
        error={errors?.homeScore}
        type="number"
        register={register}
        registerOptions={{
          required: { value: true, message: "Away score is required" },
          min: { value: 0, message: "Away score has to be larger then 0" },
        }}
      />
      <FormCheck
        label="Overtime/Shootout"
        name="overtime"
        register={register}
      />
      <LogoButton
        text="Create Match"
        type="submit"
        className="ml-auto mt-4 w-28 rounded-md bg-blue-600 px-2 py-2 text-sm"
      />
    </form>
  );
};

export const CreateLeagueForm: React.FC<CreateLeagueFormProps> = ({
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeagueValues>();

  const handleFormSubmit: SubmitHandler<CreateLeagueValues> = (
    data: CreateLeagueValues,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-1"
    >
      <FormInput
        label="League name"
        name="leagueName"
        placeholder="League name"
        error={errors?.leagueName}
        register={register}
        registerOptions={{
          required: { value: true, message: "League name is required" },
          maxLength: { value: 45, message: "Maximum league name length is 45" },
        }}
      />
      <FormCheck
        label="Set private (invite only)"
        name="isPrivate"
        register={register}
      />
      <LogoButton
        text="Create league"
        type="submit"
        className="ml-auto mt-4 w-28 rounded-md bg-blue-600 px-2 py-2 text-sm"
      />
    </form>
  );
};
