import MuiTextField from "@mui/material/TextField";
import type { ChangeEventHandler } from "react";
import { InputProps } from "./types";

interface TextFieldProps extends InputProps {
  id: string;
  label: string;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  required?: boolean;
  type?: string;
  value?: string;
}

export default function TextField(props: TextFieldProps) {
  return (
    <MuiTextField
      className={props.className || ""}
      id={props.id}
      label={props.label}
      name={props.name}
      onChange={props.onChange}
      inputRef={props.inputRef}
      required={props.required}
      style={props.style}
      type={props.type}
      value={props.value}
    />
  );
}
