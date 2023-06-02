import { ReactElement } from "react";
import Toolbar from "@mui/material/Toolbar";
import { LoginForm } from "@/modules/auth";
import { BrandLogo, Container, Paper } from "@/components";
import { BaseLayout } from "@/layouts";

import styles from "./styles/login.module.css";
import Link from "next/link";

export default function Login() {
  return (
    <Container size="lg" element="article" className={styles.container}>
      <header className={styles.header}>
        <Toolbar className={styles.toolbar}>
          <Link href="/">
            <BrandLogo className={styles.logo} />
          </Link>
          <Link className={styles.signup} href="/">
            Sign Up
          </Link>
        </Toolbar>
      </header>
      <Paper className={styles.wrapper}>
        <LoginForm />
      </Paper>
    </Container>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
