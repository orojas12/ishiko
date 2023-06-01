import styles from "./styles/base-layout.module.css";

interface BaseLayoutProps {
  children?: React.ReactNode;
}

export default function BaseLayout(props: BaseLayoutProps) {
  return <div className={styles["base-layout"]}>{props.children}</div>;
}
