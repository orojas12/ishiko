import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import Link from "next/link";

export default function Navigation() {
  return (
    <List sx={{ width: "100%" }}>
      <ListItem>
        <Link href="/overview">
          <ListItemIcon />
          <ListItemText>Overview</ListItemText>
        </Link>
      </ListItem>
      <ListItem>
        <Link href="/issues">
          <ListItemIcon />
          <ListItemText>Issues</ListItemText>
        </Link>
      </ListItem>
      <ListItem>
        <Link href="/boards">
          <ListItemIcon />
          <ListItemText>Boards</ListItemText>
        </Link>
      </ListItem>
    </List>
  );
}
