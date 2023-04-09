/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type InputProps = {
  label: string;
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  error?: FieldError;
  type?: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
};

export const FormInput: React.FC<InputProps> = ({
  label,
  name,
  defaultValue,
  placeholder,
  error,
  register,
  registerOptions,
  type = "text",
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm">
        {label}
      </label>
      <input
        className="rounded-md bg-neutral-800 px-3 py-2"
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...register(name, registerOptions)}
      />
      <span className="ml-[2px] h-5 py-1 text-xs text-red-600">
        {error?.message}
      </span>
    </div>
  );
};
