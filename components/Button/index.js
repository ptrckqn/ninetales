const Button = ({ variant, handleClick, className = "", children }) => {
  let classes = "";

  if (variant === "contained" || variant === "outlined") {
    classes += "font-bold text-2xl rounded py-2 px-6 shadow-lg border-orange-main border-4 hover:border-orange-light";
    if (variant === "contained") {
      classes += " bg-orange-main hover:bg-orange-light text-white";
    } else {
      classes += " text-orange-main";
    }
  } else if (variant === "muted") {
    classes += "font-bold text-2xl text-white bg-gray-600 rounded py-2 px-6 shadow-lg border-gray-600 border-4";
  }

  return (
    <button onClick={handleClick} className={`${classes} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
