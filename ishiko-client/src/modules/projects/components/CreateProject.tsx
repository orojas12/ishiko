import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useCreateProjectMutation } from "@/services";
import { setCurrentProject } from "../stores/projects";

export default function CreateProject() {
  const dispatch = useAppDispatch();
  const [createProject, result] = useCreateProjectMutation();
  const [open, setOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");

  useEffect(() => {
    if (result.isSuccess) {
      dispatch(setCurrentProject(result.data));
    }
  }, [result.data]);

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Create
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            createProject({ title: projectTitle });
            setProjectTitle("");
            setOpen(false);
          }}
          name="createProjectForm"
          sx={{ display: "flex", flexDirection: "column", gap: 4, padding: 4 }}
        >
          <DialogTitle sx={{ padding: 0 }}>Create new project</DialogTitle>
          <TextField
            id="createProjectTitle"
            label="Project Title"
            onChange={(e) => setProjectTitle(e.target.value)}
            sx={{ width: 350 }}
            required
            value={projectTitle}
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Create Project
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
