package app.ishiko.api.project;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import app.ishiko.api.exception.NotFoundException;
import app.ishiko.api.project.issue.dto.IssueLabelDto;
import app.ishiko.api.project.issue.dto.IssueStatusDto;
import app.ishiko.api.project.issue.model.IssueLabel;
import app.ishiko.api.project.issue.model.IssueStatus;
import app.ishiko.api.project.issue.repository.IssueLabelRepository;
import app.ishiko.api.project.issue.repository.IssueStatusRepository;

@Service
public class ProjectService {

    private final IssueStatusRepository statusRepository;
    private final IssueLabelRepository labelRepository;
    private final ProjectRepository projectRepository;

    public ProjectService(IssueStatusRepository statusRepository,
            IssueLabelRepository labelRepository,
            ProjectRepository projectRepository) {
        this.statusRepository = statusRepository;
        this.labelRepository = labelRepository;
        this.projectRepository = projectRepository;
    }

    ProjectDto getProjectData(String projectId, String username)
            throws NotFoundException {
        Optional<Project> projectOpt = projectRepository
                .findByIdAndOwner_Username(projectId, username);

        if (projectOpt.isEmpty()) {
            throw new NotFoundException("Project id " + projectId
                    + " not found for user " + username);
        }

        Project project = projectOpt.get();
        ProjectDto dto = new ProjectDto(project.getId(), project.getName(),
                project.getDescription(), project.getOwner().getUsername());

        // List<IssueStatus> statuses =
                // statusRepository.findAllByProjectId(projectId);
        // List<IssueLabel> labels = labelRepository.findAllByProjectId(projectId);

        dto.setStatuses(project.getIssueStatuses().stream()
                .map((status -> new IssueStatusDto(status.getId(),
                        status.getName())))
                .toList());
        dto.setLabels(project.getIssueLabels().stream()
                .map(label -> new IssueLabelDto(label.getId(), label.getName()))
                .toList());

        return dto;
    }
}
