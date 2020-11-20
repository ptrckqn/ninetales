import React from "react";

const Svg = ({ className, children, ...rest }) => {
  const classes = "fill-current stroke-current stroke-1 ";

  return (
    <svg className={classes + className} {...rest}>
      {children}
    </svg>
  );
};

export default Svg;
