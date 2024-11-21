import { ButtonHTMLAttributes, FC } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button className="btn btn-lg btn-primary" {...rest}>
      {children}
    </button>
  );
};
