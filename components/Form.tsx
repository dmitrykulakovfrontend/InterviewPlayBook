import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createElement } from "react";
import { ReactNode } from "react";
import type { UseFormHandleSubmit, FieldValues } from "react-hook-form";

export type FormProps<T extends FieldValues> = {
  children: ReactNode;
  buttonLabel?: string;
  onSubmit: (data: T) => void;
  handleSubmit: UseFormHandleSubmit<T>;
  className?: string;
  icon: IconProp;
};

export default function Form<T extends FieldValues>({
  buttonLabel,
  children,
  onSubmit,
  handleSubmit,
  icon,
  className,
  ...rest
}: FormProps<T>) {
  return (
    <div className="w-full bg-white rounded-lg">
      <form
        className={
          "px-5 py-7 rounded-lg  gap-4 flex flex-col items-center " +
          (className ? className : "")
        }
        onSubmit={handleSubmit(onSubmit)}
        {...rest}
      >
        {Array.isArray(children)
          ? children.map((child) => {
              return child?.props?.name
                ? createElement(child.type, {
                    ...{
                      ...child.props,
                      key: child.props.name,
                    },
                  })
                : child;
            })
          : children}

        {buttonLabel && (
          <button
            type="submit"
            className="inline-block px-5 py-3 text-sm font-semibold text-center text-white transition duration-200 bg-blue-500 rounded-lg shadow-sm w-fit hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-md"
          >
            <span className="inline-block mr-2">{buttonLabel}</span>
            <FontAwesomeIcon icon={icon} />
          </button>
        )}
      </form>
    </div>
  );
}
