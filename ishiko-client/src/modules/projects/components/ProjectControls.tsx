import { useAppSelector } from "@/hooks";
import CreateProject from "./CreateProject";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

export default function ProjectControls() {
  const currentProject = useAppSelector((state) => state.currentProject);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="selectedProjectLabel">Project</InputLabel>
        <Select
          id="selectedProject"
          labelId="selectedProjectLabel"
          label="Project"
        >
          <MenuItem value="">No projects created</MenuItem>
        </Select>
      </FormControl>
      <CreateProject />
    </>
  );
}
