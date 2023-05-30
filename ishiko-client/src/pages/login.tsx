import { LoginForm } from "@/modules/auth";
import { Box, Container, Paper } from "@/components";
import styles from "./styles/login.module.css";

export default function LoginPage() {
  return (
    <Container size="lg" element="article" className={styles.container}>
      <Paper className={styles.wrapper}>
        <LoginForm />
      </Paper>
    </Container>
  );
}
