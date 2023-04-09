/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RegisterOptions, UseFormRegister } from "react-hook-form";

type InputProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
};

export const FormCheck: React.FC<InputProps> = ({
  label,
  name,
  defaultValue,
  placeholder,
  register,
  registerOptions,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="mb-4 flex items-center gap-1">
        <input
          className="h-4 w-4 rounded  accent-blue-500 focus:ring-2"
          type="checkbox"
          defaultValue={defaultValue}
          placeholder={placeholder}
          {...register(name, registerOptions)}
        />
        <label htmlFor={name} className="text-sm">
          {label}
        </label>
      </div>
    </div>
  );
};
