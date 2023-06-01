import MuiBox from "@mui/material/Box";
import { ComponentProps } from "./types";

interface BoxProps extends ComponentProps {
  children?: React.ReactNode;
}

export default function Box(props: BoxProps) {
  return (
    <MuiBox className={props.className || ""} style={props.style}>
      {props.children}
    </MuiBox>
  );
}
