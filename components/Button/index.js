const Button = ({ variant, small, handleClick, className = "", children }) => {
  let classes = `font-bold rounded ${small ? " text-md py-1 px-4" : " text-2xl py-2 px-6"}`;

  if (variant === "contained" || variant === "outlined") {
    classes += " shadow-lg border-orange-main border-4 hover:border-orange-light";
    if (variant === "contained") {
      classes += " text-white bg-orange-main hover:bg-orange-light";
    } else {
      classes += " text-orange-main";
    }
  } else if (variant === "muted") {
    classes += " text-white bg-gray-600 shadow-lg border-gray-600 border-4";
  }

  return (
    <button onClick={handleClick} className={`${classes} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
