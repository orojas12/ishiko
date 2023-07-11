package app.ishiko.ishikoserver.issues;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import app.ishiko.ishikoserver.users.User;
import app.ishiko.ishikoserver.users.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class IssueServiceTest {

    @Mock
    IssueDao issueDao;

    @Mock
    UserService userService;

    @Test
    void assignUser_Username_IssueId_returnsIssueWithAddedUser() throws ResourceNotFoundException {
        User user = new User();
        Issue issue = new Issue();
        issue.setAssignees(new ArrayList<>());
        when(userService.getUser(any())).thenReturn(user);
        when(issueDao.getIssue(anyInt())).thenReturn(issue);
        when(issueDao.save(any())).thenAnswer(i -> i.getArguments()[0]);
        IssueService issueService = new IssueService(issueDao, userService);
        Issue newIssue = issueService.assignUser("user", 0);
        assertThat(newIssue).isEqualTo(issue);
        assertThat(newIssue.getAssignees().size()).isEqualTo(1);
        assertThat(newIssue.getAssignees().contains(user)).isTrue();
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
        IssueService issueService = new IssueService(issueDao, userService);
        issueService.createIssue(issueDto);
        verify(issueDao).save(argThat(issue -> {
            assertThat(issue.getSubject()).isEqualTo("subject");
            assertThat(issue.getAssignees().size()).isEqualTo(1);
            assertThat(issue.getAssignees().get(0).getUsername()).isEqualTo("user1");
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
        IssueService issueService = new IssueService(issueDao, userService);
        IssueDto newIssueDto = issueService.createIssue(issueDto);
        assertThat(newIssueDto.getSubject()).isEqualTo("subject");
        assertThat(newIssueDto.getAssignees().size()).isEqualTo(1);
        assertThat(newIssueDto.getAssignees().contains("user1")).isTrue();
    }
}
