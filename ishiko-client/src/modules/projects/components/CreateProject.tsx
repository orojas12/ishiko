import { Box, Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function CreateProject() {
  const [open, setOpen] = useState(false);

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
          sx={{ display: "flex", flexDirection: "column", gap: 4, padding: 4 }}
        >
          <DialogTitle sx={{ padding: 0 }}>Create new project</DialogTitle>
          <TextField
            id="createProjectTitle"
            label="Project Title"
            sx={{ width: 350 }}
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained">Create</Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
