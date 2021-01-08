import React from "react";

const Button = ({
  variant,
  small,
  handleClick,
  className = "",
  disabled,
  children,
}) => {
  let classes = `font-bold rounded ${
    small ? " text-sm py-1 px-4" : " text-lg py-1 px-4"
  }`;

  if (variant === "contained" || variant === "outlined") {
    classes +=
      " shadow-lg border-orange-main border-4 hover:border-orange-light";
    if (variant === "contained") {
      classes += " text-white bg-orange-main hover:bg-orange-light";
    } else {
      classes += " text-orange-main";
    }
  } else if (variant === "muted") {
    classes += " text-white bg-gray-600 shadow-lg border-gray-600 border-4";
  }

  return (
    <button
      onClick={handleClick}
      className={`${classes} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
