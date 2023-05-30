import Typography from "@mui/material/Typography";
import { ComponentProps } from "./types";

interface ParagraphProps extends ComponentProps {
  align?: "center" | "left" | "right";
  children?: React.ReactNode;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "caption";
}

export default function Paragraph(props: ParagraphProps) {
  return (
    <Typography
      align={props.align}
      className={props.className || ""}
      component="p"
      style={props.style}
      variant={props.variant}
    >
      {props.children}
    </Typography>
  );
}
