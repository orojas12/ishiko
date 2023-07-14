package app.ishiko.ishikoserver.issues;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import app.ishiko.ishikoserver.projects.ProjectService;
import app.ishiko.ishikoserver.users.User;
import app.ishiko.ishikoserver.users.UserService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class IssueService {

    private final IssueDao issueDao;
    private final ProjectService projectService;
    private final UserService userService;

    public IssueService(IssueDao issueDao, ProjectService projectService, UserService userService) {
        this.issueDao = issueDao;
        this.projectService = projectService;
        this.userService = userService;
    }

    public ProjectIssuesDto getProjectIssues(int projectId) throws ResourceNotFoundException {
        if (!projectService.projectExists(projectId)) {
            throw new ResourceNotFoundException("Project '" + projectId + "' not found");
        }
        Set<Issue> issues = issueDao.getAllByProjectId(projectId);
        List<IssueDto> issueDtoList = issues.stream().map(issue -> {
            var issueDto = new IssueDto(issue.getId(), issue.getSubject(),
                    issue.getDateTime().getEpochSecond(), null, projectId);
            List<String> usernames = issue.getAssignedTo().stream().map(User::getUsername).toList();
            issueDto.setAssignedTo(usernames);
            return issueDto;
        }).toList();
        return new ProjectIssuesDto(projectId, issueDtoList);
    }

    public IssueDto createIssue(IssueDto issueDto) throws ResourceNotFoundException {
        if (!projectService.projectExists(issueDto.getProjectId())) {
            throw new ResourceNotFoundException("Project '" + issueDto.getProjectId() + "' not found");
        }
        List<User> assignees = new ArrayList<>();
        for (String username : issueDto.getAssignedTo()) {
            User user = userService.getUser(username);
            assignees.add(user);
        }
        Issue issue = new Issue();
        issue.setSubject(issueDto.getSubject());
        issue.setDateTime(Instant.ofEpochSecond(issueDto.getDateTime()));
        issue.setAssignedTo(assignees);
        Issue savedIssue = issueDao.save(issue);
        List<String> usernames = savedIssue.getAssignedTo().stream().map(User::getUsername).toList();
        return new IssueDto(savedIssue.getId(), savedIssue.getSubject(),
                savedIssue.getDateTime().getEpochSecond(), usernames, issueDto.getProjectId());
    }

    public Issue assignUser(String username, int id) throws ResourceNotFoundException {
        User user = userService.getUser(username);
        Issue issue = issueDao.getById(id);
        issue.getAssignedTo().add(user);
        return issueDao.save(issue);
    }

    public void deleteIssue(int id) throws ResourceNotFoundException {
        if (issueDao.existsById(id)) {
            issueDao.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Issue '" + id + "' not found");
        }
    }
}
