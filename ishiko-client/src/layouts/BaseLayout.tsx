import { Box } from "@mui/material";

interface BaseLayoutProps {
  children?: React.ReactNode;
}

export default function BaseLayout(props: BaseLayoutProps) {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.surface.dark,
        color: theme.palette.surface.contrastText,
        height: "100%",
        left: 0,
        position: "fixed",
        top: 0,
        width: "100%",
      })}
    >
      {props.children}
    </Box>
  );
}
