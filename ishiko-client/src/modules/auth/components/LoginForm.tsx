import Link from "next/link";
import { Button, Heading, Paragraph, TextField } from "@/components";
import styles from "./styles/login-form.module.css";
import { useRef, FormEventHandler } from "react";
import { useLoginMutation } from "@/services";

interface LoginFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export default function LoginForm(props: LoginFormProps) {
  const [login] = useLoginMutation();

  const username = useRef<HTMLInputElement>();
  const password = useRef<HTMLInputElement>();

  return (
    <form
      name="login-form"
      className={styles.form}
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
      <Heading element="h1" variant="h5">
        Log In
      </Heading>
      <div className={styles.fields}>
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
      </div>
      <Button
        className={styles["btn-submit"]}
        size="large"
        type="submit"
        variant="contained"
      >
        Log In
      </Button>
      <Paragraph variant="body2">
        Don't have an account?&nbsp;
        <Link href="">Sign up</Link>
      </Paragraph>
    </form>
  );
}
