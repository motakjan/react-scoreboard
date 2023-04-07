import React, { forwardRef } from "react";

type InputProps = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label: string;
  prefix: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, label, prefix }, ref) => {
    return (
      <div className="flex flex-col pb-6 md:pb-0">
        <label htmlFor="name" className="input-label mb-2 text-base">
          {label}
        </label>
        <div>
          <label className="input-field inline-flex items-baseline rounded-md border-none bg-neutral-950 p-4 shadow-md">
            <span className="flex-none select-none leading-none text-white">
              {prefix}
            </span>
            <div className="flex-1 leading-none">
              <input
                id="handle"
                type="text"
                className="placeholder-blue no-outline w-full bg-neutral-950 p-0 text-slate-300 focus:outline-0"
                name="handle"
                placeholder="nhl_cup_1"
                onChange={onChange}
                ref={ref}
              />
            </div>
          </label>
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
