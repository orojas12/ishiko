import MuiPaper from "@mui/material/Paper";
import { ComponentProps } from "./types";

interface PaperProps extends ComponentProps {
  children?: React.ReactNode;
}

export default function Paper(props: PaperProps) {
  return (
    <MuiPaper style={props.style} className={props.className || ""}>
      {props.children}
    </MuiPaper>
  );
}
