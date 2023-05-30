import Link from "next/link";
import { Button, Heading, Paragraph, TextField } from "@/components";
import styles from "./styles/login-form.module.css";
import { FormEventHandler } from "react";

interface LoginFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export default function LoginForm(props: LoginFormProps) {
  return (
    <form
      name="login-form"
      className={styles.form}
      onSubmit={(e) => {
        if (props.onSubmit) {
          e.preventDefault();
          props.onSubmit(e);
        }
      }}
    >
      <Heading element="h1" variant="h5">
        Log In
      </Heading>
      <div className={styles.fields}>
        <TextField
          id="login-username"
          label="Username"
          name="username"
          required
        />
        <TextField
          id="login-password"
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
