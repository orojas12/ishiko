import MuiContainer from "@mui/material/Container";
import { ComponentProps } from "./types";

interface ContainerProps extends ComponentProps {
  children?: React.ReactNode;
  element?: "div" | "article" | "section";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function Container(props: ContainerProps) {
  return (
    <MuiContainer
      className={props.className || ""}
      component={props.element || "div"}
      maxWidth={props.size}
      style={props.style}
    >
      {props.children}
    </MuiContainer>
  );
}
