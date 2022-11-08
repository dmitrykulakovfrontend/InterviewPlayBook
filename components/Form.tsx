import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createElement } from "react";
import { ReactNode } from "react";

export type FormProps = {
  defaultValues?: any;
  children?: ReactNode;
  buttonLabel?: string;
  onSubmit?: any;
  handleSubmit?: any;
  register?: any;
  className?: string;
  icon: IconProp;
};

export default function Form({
  defaultValues,
  buttonLabel = "Submit",
  children,
  onSubmit,
  handleSubmit,
  register,
  icon,
  className,
  ...rest
}: FormProps) {
  return (
    <div className="bg-white w-full rounded-lg">
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
              return child.props.name
                ? createElement(child.type, {
                    ...{
                      ...child.props,
                      register,
                      key: child.props.name,
                    },
                  })
                : child;
            })
          : children}

        <button
          type="submit"
          className="w-fit py-3 px-5 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
        >
          <span className="inline-block mr-2">{buttonLabel}</span>
          <FontAwesomeIcon icon={icon} />
        </button>
      </form>
    </div>
  );
}
