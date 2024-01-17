package app.ishiko.api.project;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import app.ishiko.api.exception.HttpErrorResponseBodyDto;
import app.ishiko.api.exception.NotFoundException;
import app.ishiko.api.project.issue.dto.IssueDto;
import app.ishiko.api.project.issue.service.IssueService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private IssueService issueService;
    private ProjectRepository projectRepository;

    public ProjectController(IssueService issueService, ProjectRepository projectRepository) {
        this.issueService = issueService;
        this.projectRepository = projectRepository;
    }

    @GetMapping("/{projectId}/issues")
    public List<IssueDto> getProjectIssues(Authentication auth, @PathVariable String projectId)
            throws NotFoundException {
        Optional<Project> project =
                projectRepository.findByIdAndUser_Username(projectId, auth.getName());

        if (project.isEmpty()) {
            throw new NotFoundException(
                    "Project id " + projectId + " not found for user " + auth.getName());
        }

        return issueService.getIssues(projectId);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException.class)
    public HttpErrorResponseBodyDto notFound(HttpServletRequest req, Exception e) {
        return new HttpErrorResponseBodyDto(e.getMessage());
    }
}
