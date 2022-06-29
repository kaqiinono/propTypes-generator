import React from "react";
import PropTypes from "prop-types";
import "./button.scss";

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, backgroundColor, size, label, children, ...props }) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";
  return (
    <button
      type='button'
      className={[ "storybook-button", `storybook-button--${size}`, mode ].join(
        " "
      )}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label}{children}
    </button>
  );
};

Button.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  size: PropTypes.oneOf([ "small", "medium", "large" ])
}

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: "medium",
  onClick: () => {
  },
};
