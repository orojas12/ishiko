import { ReactElement } from "react";
import { NavLayout } from "@/layouts";
import { Typography } from "@mui/material";
import { useAppSelector } from "@/hooks";

export default function Overview() {
  const currentProject = useAppSelector((state) => state.currentProject);

  return (
    <>
      <Typography component="h1" variant="h5" paragraph>
        {currentProject.title}
      </Typography>
      <Typography>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis,
        numquam quas? Dicta, nihil quo, nulla dolore amet rerum libero
        voluptatibus maiores, est accusantium fugit excepturi impedit. Tempora
        ducimus laboriosam vero.
      </Typography>
    </>
  );
}

Overview.getLayout = function getLayout(page: ReactElement) {
  return <NavLayout>{page}</NavLayout>;
};
