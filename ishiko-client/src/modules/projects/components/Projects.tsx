import { useAppDispatch, useAppSelector } from "@/hooks";
import { useGetProjectsQuery } from "@/services";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemProps,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import { setCurrentProject } from "../stores/projects";

interface StyledListItemProps extends ListItemProps {
  selected?: boolean;
}

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "selected",
})<StyledListItemProps>(({ selected, theme }) => ({
  padding: 0,
  ...(selected && {
    backgroundColor: theme.palette.surface.dark,
  }),
}));

export default function Projects() {
  const currentProject = useAppSelector((state) => state.currentProject);
  const dispatch = useAppDispatch();
  const { data: projects } = useGetProjectsQuery();

  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ fontWeight: 600 }}>Projects</Typography>
      <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {projects?.map((project) => (
          <StyledListItem
            key={project.id}
            selected={currentProject.id === project.id}
          >
            <ListItemButton
              onClick={() => dispatch(setCurrentProject(project))}
            >
              <ListItemText>{project.title}</ListItemText>
            </ListItemButton>
          </StyledListItem>
        ))}
      </List>
    </Box>
  );
}
