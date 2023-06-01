import { SxProps } from "@mui/system";
import { CSSProperties, MutableRefObject } from "react";

export interface ComponentProps {
  style?: CSSProperties;
  className?: string;
}

export interface InputProps extends ComponentProps {
  inputRef?: MutableRefObject<unknown>;
}
