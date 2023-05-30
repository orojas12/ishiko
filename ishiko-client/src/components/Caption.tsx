import Typography from "@mui/material/Typography";
import { ComponentProps } from "./types";

interface CaptionProps extends ComponentProps {
  align?: "center" | "left" | "right";
  children?: React.ReactNode;
}

export default function Caption(props: CaptionProps) {
  return (
    <Typography
      align={props.align}
      className={props.className || ""}
      component="span"
      style={props.style}
      variant="caption"
    >
      {props.children}
    </Typography>
  );
}
