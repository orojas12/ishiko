import { ReactElement } from "react";
import { NavLayout } from "@/layouts";
import { Typography } from "@mui/material";

export default function Issues() {
  return <Typography>Issues</Typography>;
}

Issues.getLayout = function getLayout(page: ReactElement) {
  return <NavLayout>{page}</NavLayout>;
};
