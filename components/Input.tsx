import React, { InputHTMLAttributes } from "react";
import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface InputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLElement> {
  name: Path<T>;
  label: string;
  error?: string;
  register: UseFormRegister<T>;
  className?: string;
  textarea?: boolean;
}

const className =
  "w-full px-3 py-3 font-semibold text-gray-800 bg-white border border-gray-400 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 focus:border-blue-500 focus:outline-none";

export default function Input<T extends FieldValues>({
  register,
  name,
  error,
  label,
  textarea,
  ...rest
}: InputProps<T>) {
  return (
    <>
      <label className="hidden" htmlFor={name}>
        {label}
      </label>
      {error && (
        <span role="alert" className="text-red-400">
          {error}
        </span>
      )}
      {textarea ? (
        <textarea
          className={className}
          aria-invalid={error ? "true" : "false"}
          {...register(name)}
          {...rest}
        />
      ) : (
        <input
          className={className}
          aria-invalid={error ? "true" : "false"}
          {...register(name)}
          {...rest}
        />
      )}
    </>
  );
}
