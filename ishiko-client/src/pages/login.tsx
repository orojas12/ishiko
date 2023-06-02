import { LoginForm } from "@/modules/auth";
import { BrandLogo } from "@/components";
import { BaseLayout } from "@/layouts";
import styles from "./styles/login.module.css";

import { ReactElement } from "react";
import Link from "next/link";
import { Box, Container, Paper, Toolbar } from "@mui/material";

export default function Login() {
  return (
    <Container
      component="article"
      sx={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box
        component="header"
        sx={{ position: "absolute", top: 0, width: "100%" }}
      >
        <Toolbar
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link href="/">
            <BrandLogo style={{ height: "1.5em" }} />
          </Link>
          <Link
            style={{
              color: "#1976d2",
              padding: "0.5em",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
            href="/"
          >
            Sign Up
          </Link>
        </Toolbar>
      </Box>
      <Paper sx={{ maxWidth: 400, padding: "1em", width: "100%" }}>
        <LoginForm />
      </Paper>
    </Container>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
