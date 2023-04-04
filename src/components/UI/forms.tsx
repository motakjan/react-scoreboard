import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";

type CreatePlayerFormProps = {
  onSubmit: SubmitHandler<FieldValues>;
};

export const CreatePlayerForm: React.FC<CreatePlayerFormProps> = ({
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit: SubmitHandler<FieldValues> = (
    data: FieldValues,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" {...register("name", { required: true })} />
        {errors.name && <span>This field is required</span>}
      </div>

      <div>
        <label htmlFor="mmr">MMR</label>
        <input
          type="number"
          {...register("mmr", { required: true, min: 0, max: 10000 })}
        />
        {errors.mmr?.type === "required" && <span>This field is required</span>}
        {errors.mmr?.type === "min" && (
          <span>MMR must be greater than or equal to 0</span>
        )}
        {errors.mmr?.type === "max" && (
          <span>MMR must be less than or equal to 10000</span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
