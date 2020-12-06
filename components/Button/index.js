const Button = ({ variant, handleClick, className = "", children }) => {
  let classes = "";

  if (variant === "contained" || variant === "outlined") {
    classes += "font-bold text-2xl rounded-full py-2 px-6 shadow-lg";
    if (variant === "contained") {
      classes += " bg-orange-main hover:bg-orange-light text-white";
    } else {
      classes += " text-orange-main border-orange-main border-4";
    }
  } else {
  }

  return (
    <button onClick={handleClick} className={`${classes} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
