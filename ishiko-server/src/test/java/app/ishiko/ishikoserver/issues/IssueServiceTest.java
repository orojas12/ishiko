package app.ishiko.ishikoserver.issues;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import app.ishiko.ishikoserver.projects.Project;
import app.ishiko.ishikoserver.projects.ProjectService;
import app.ishiko.ishikoserver.users.User;
import app.ishiko.ishikoserver.users.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class IssueServiceTest {

    @Mock
    IssueDao issueDao;

    @Mock
    UserService userService;

    @Mock
    ProjectService projectService;

    @Test
    void getProjectIssues_ProjectId_returnsProjectIssues() throws ResourceNotFoundException {
        // mock dependencies
        var user = new User();
        user.setUsername("user");
        var project = new Project();
        project.setId(0);
        Issue issue = new Issue(0, "subject", Instant.now(), List.of(user), project);
        when(issueDao.getAllByProjectId(anyInt())).thenReturn(Set.of(issue));
        when(projectService.projectExists(anyInt())).thenReturn(true);

        IssueService issueService = new IssueService(issueDao, projectService, userService);
        ProjectIssuesDto issuesDto = issueService.getProjectIssues(0);

        // returned data should equal that mocked above
        assertThat(issuesDto.getProjectId()).isEqualTo(0);
        assertThat(issuesDto.getIssues().size()).isEqualTo(1);
        assertThat(issuesDto.getIssues().get(0).getId()).isEqualTo(issue.getId());
        assertThat(issuesDto.getIssues().get(0).getSubject()).isEqualTo(issue.getSubject());
        var issueDtoDate = Instant.ofEpochSecond(issuesDto.getIssues().get(0).getDateTime());
        assertThat(issueDtoDate.getEpochSecond()).isEqualTo(issue.getDateTime().getEpochSecond());
        assertThat(issuesDto.getIssues().get(0).getAssignedTo().size()).isEqualTo(1);
        assertThat(issuesDto.getIssues().get(0).getAssignedTo().get(0)).isEqualTo("user");
        assertThat(issuesDto.getIssues().get(0).getProjectId()).isEqualTo(project.getId());
    }

    @Test
    void assignUser_Username_IssueId_returnsIssueWithAddedUser() throws ResourceNotFoundException {
        // mock dependencies
        User user = new User();
        Issue issue = new Issue();
        issue.setAssignedTo(new ArrayList<>());
        when(userService.getUser(any())).thenReturn(user);
        when(issueDao.getById(anyInt())).thenReturn(issue);
        when(issueDao.save(any())).thenAnswer(i -> i.getArguments()[0]);

        IssueService issueService = new IssueService(issueDao, projectService, userService);
        Issue newIssue = issueService.assignUser("user", 0);

        assertThat(newIssue.getId()).isEqualTo(issue.getId());
        assertThat(newIssue.getAssignedTo().size()).isEqualTo(1);
        assertThat(newIssue.getAssignedTo().get(0).getUsername())
                .isEqualTo(issue.getAssignedTo().get(0).getUsername());
    }

    @Test
    void createIssue_IssueDto_createsNewIssue() throws ResourceNotFoundException {
        IssueDto issueDto = new IssueDto("subject", List.of("user1"));
        when(userService.getUser(anyString())).thenAnswer(i -> {
            User user = new User();
            user.setUsername((String) i.getArguments()[0]);
            return user;
        });
        when(issueDao.save(any())).thenAnswer(i -> i.getArguments()[0]);
        when(projectService.projectExists(anyInt())).thenReturn(true);

        IssueService issueService = new IssueService(issueDao, projectService, userService);
        issueService.createIssue(issueDto);

        verify(issueDao).save(argThat(issue -> {
            assertThat(issue.getSubject()).isEqualTo("subject");
            assertThat(issue.getAssignedTo().size()).isEqualTo(1);
            assertThat(issue.getAssignedTo().get(0).getUsername()).isEqualTo("user1");
            return true;
        }));
    }

    @Test
    void createIssue_IssueDto_returnsNewIssueDto() throws ResourceNotFoundException {
        IssueDto issueDto = new IssueDto("subject", List.of("user1"));
        when(userService.getUser(anyString())).thenAnswer(i -> {
            User user = new User();
            user.setUsername((String) i.getArguments()[0]);
            return user;
        });
        when(issueDao.save(any())).thenAnswer(i -> i.getArguments()[0]);
        when(projectService.projectExists(anyInt())).thenReturn(true);

        IssueService issueService = new IssueService(issueDao, projectService, userService);
        IssueDto newIssueDto = issueService.createIssue(issueDto);

        assertThat(newIssueDto.getSubject()).isEqualTo("subject");
        assertThat(newIssueDto.getAssignedTo().size()).isEqualTo(1);
        assertThat(newIssueDto.getAssignedTo().contains("user1")).isTrue();
    }

    @Test
    void deleteIssue_IssueId_verifiesAndDeletesIssue() throws ResourceNotFoundException {
        when(issueDao.existsById(anyInt())).thenReturn(true);

        IssueService issueService = new IssueService(issueDao, projectService, userService);
        issueService.deleteIssue(0);

        verify(issueDao).existsById(0);
        verify(issueDao).deleteById(0);
    }

    @Test
    void deleteIssue_NonExistentIssueId_throwsResourceNotFoundException() {
        when(issueDao.existsById(anyInt())).thenReturn(false);

        IssueService issueService = new IssueService(issueDao, projectService, userService);

        assertThatThrownBy(() -> issueService.deleteIssue(0))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
