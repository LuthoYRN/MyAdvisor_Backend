import React from "react";

const Text = ({ type, children, color, classNames }) => {
  let Element;
  let classes = "";
  classNames = classNames ? classNames : "";

  switch (type) {
    case "heading":
      Element = "h1";
      break;
    case "sm-heading":
      Element = "h3";
      break;
    case "subheading":
      Element = "h2";
      break;
    case "sm-subheading":
      Element = "h4";
      break;
    case "paragraph":
      Element = "p";
      break;
    case "paragraph-strong":
      Element = "p";
      classes = " font-semibold";
      break;
    default:
      Element = "p";
  }

  if (color) {
    classes += ` text-${color}`;
  }

  return <Element class={classNames + classes}>{children}</Element>;
};

export default Text;
