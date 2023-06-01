import MuiButton from "@mui/material/Button";
import type { ComponentProps } from "./types";

interface ButtonProps extends ComponentProps {
  children?: React.ReactNode;
  color?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
  variant?: "contained" | "outlined";
}

export default function Button(props: ButtonProps) {
  return (
    <MuiButton
      className={props.className || ""}
      color={props.color}
      size={props.size}
      style={props.style}
      type={props.type}
      variant={props.variant}
    >
      {props.children}
    </MuiButton>
  );
}
