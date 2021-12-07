import { primary, secondary } from "../../colors/color";

const Button = ({ children, red, fullwidth, ...other }) => {
  return (
    <button
      {...other}
      className={`input ${fullwidth ? "fullwidth" : ""}`}
      type="button"
      style={{
        backgroundColor: red ? secondary : primary,
        color: "white",
        minWidth: 100,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
