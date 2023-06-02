import { useLoginMutation } from "@/services";
import styles from "./styles/login-form.module.css";

import { useRef, FormEventHandler } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import Link from "next/link";

interface LoginFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export default function LoginForm(props: LoginFormProps) {
  const [login] = useLoginMutation();

  const username = useRef<HTMLInputElement>();
  const password = useRef<HTMLInputElement>();

  return (
    <Box
      component="form"
      name="login-form"
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "3em",
        justifyContent: "center",
        padding: "3.5em",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        if (props.onSubmit) {
          props.onSubmit(e);
        }
        const usernamePassword = {
          username: username.current?.value || "",
          password: password.current?.value || "",
        };
        login(usernamePassword);
      }}
    >
      <Typography component="h1" variant="h5">
        Log In
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5em",
          width: "100%",
        }}
      >
        <TextField
          id="login-username"
          inputRef={username}
          label="Username"
          name="username"
          required
        />
        <TextField
          id="login-password"
          inputRef={password}
          label="Password"
          name="password"
          type="password"
          required
        />
      </Box>
      <Button
        size="large"
        sx={{
          width: "100%",
        }}
        type="submit"
        variant="contained"
      >
        Log In
      </Button>
      <Typography variant="body2">
        Don't have an account?&nbsp;
        <Link href="">Sign up</Link>
      </Typography>
    </Box>
  );
}
