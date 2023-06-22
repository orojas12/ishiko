import BaseLayout from "./BaseLayout";
import { BrandLogo, Navigation } from "@/components";
import { CreateProject, Projects } from "@/modules/projects";

import {
  AppBar,
  Box,
  Button,
  Drawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

interface NavLayoutProps {
  children?: React.ReactNode;
}

export default function NavLayout(props: NavLayoutProps) {
  const router = useRouter();
  const drawerWidth = 250;

  return (
    <BaseLayout>
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
          }}
          PaperProps={{ elevation: 1 }}
        >
          <Toolbar>
            <BrandLogo style={{ height: "1.5em" }} />
          </Toolbar>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              padding: 3,
              width: drawerWidth,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <TextField id="search" label="Search" size="small" />
            </Box>
            <Navigation />
            <Projects />
          </Box>
        </Drawer>
        <Drawer
          variant="temporary"
          anchor="left"
          sx={{
            display: { xs: "none", sm: "block" },
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: 4,
              width: drawerWidth,
            }}
          >
            <BrandLogo style={{ height: "1.5em" }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <TextField id="search" label="Search" size="small" />
            </Box>
            <Navigation />
            <Projects />
          </Box>
        </Drawer>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <AppBar
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ textTransform: "capitalize" }}>
                {router.asPath.slice(1)}
              </Typography>
              <CreateProject />
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              flexGrow: 1,
              padding: 3,
            }}
          >
            <Toolbar />
            {props.children}
          </Box>
        </Box>
      </Box>
    </BaseLayout>
  );
}
