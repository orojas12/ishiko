import { Box } from "@mui/material";

interface BaseLayoutProps {
  children?: React.ReactNode;
}

export default function BaseLayout(props: BaseLayoutProps) {
  return (
    <Box
      sx={{ height: "100%", left: 0, position: "fixed", top: 0, width: "100%" }}
    >
      {props.children}
    </Box>
  );
}
