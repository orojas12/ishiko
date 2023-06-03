import { ReactElement } from "react";
import { NavLayout } from "@/layouts";

export default function Overview() {}

Overview.getLayout = function getLayout(page: ReactElement) {
  return <NavLayout>{page}</NavLayout>;
};
