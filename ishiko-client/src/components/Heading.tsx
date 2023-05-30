import Typography from "@mui/material/Typography";
import { ComponentProps } from "./types";

interface HeadingProps extends ComponentProps {
  align?: "center" | "left" | "right";
  children?: string;
  element: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function Heading(props: HeadingProps) {
  return (
    <Typography
      align={props.align}
      className={props.className || ""}
      component={props.element}
      style={props.style}
      variant={props.variant}
    >
      {props.children}
    </Typography>
  );
}
