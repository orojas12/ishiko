package app.ishiko.ishikoserver.projects;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @GetMapping
    public ProjectListResponse getProjects(Principal principal) {
        try {
            List<ProjectResponse> projects = service.getUserProjects(principal.getName());
            return new ProjectListResponse(projects);
        } catch (ResourceNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(@RequestBody ProjectRequest project, Principal principal) {
        ProjectRequest newProject = new ProjectRequest(project.getTitle(), principal.getName());
        try {
            return service.createProject(newProject);
        } catch (ResourceNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
