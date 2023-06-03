import BaseLayout from "./BaseLayout";
import { BrandLogo } from "@/components";
import { ProjectControls } from "@/modules/projects";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

interface NavLayoutProps {
  children?: React.ReactNode;
}

export default function NavLayout(props: NavLayoutProps) {
  return (
    <BaseLayout>
      <div>
        <Drawer variant="permanent" anchor="left">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: 4,
              width: 200,
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
              <ProjectControls />
            </Box>
            <List sx={{ backgroundColor: "", width: "100%" }}>
              <ListItem>
                <ListItemIcon />
                <ListItemText>Overview</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemIcon />
                <ListItemText>Issues</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemIcon />
                <ListItemText>Boards</ListItemText>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box>Content</Box>
      </div>
    </BaseLayout>
  );
}
