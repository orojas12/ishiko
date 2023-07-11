package app.ishiko.ishikoserver.issues;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import app.ishiko.ishikoserver.users.User;
import app.ishiko.ishikoserver.users.UserService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class IssueService {

    private IssueDao issueDao;
    private UserService userService;

    public IssueService(IssueDao issueDao, UserService userService) {
        this.issueDao = issueDao;
        this.userService = userService;
    }

    public IssueDto createIssue(IssueDto issueDto) throws ResourceNotFoundException {
        List<User> assignees = new ArrayList<>();
        for (String username : issueDto.getAssignees()) {
            User user = userService.getUser(username);
            assignees.add(user);
        }
        Issue issue = new Issue();
        issue.setSubject(issueDto.getSubject());
        issue.setDate(new Date(issueDto.getUnixTime() * 1000));
        issue.setAssignees(assignees);
        Issue savedIssue = issueDao.save(issue);
        List<String> usernames = savedIssue.getAssignees().stream().map(User::getUsername).toList();
        return new IssueDto(savedIssue.getId(), savedIssue.getSubject(),
                savedIssue.getDate().getTime() / 1000, usernames);
    }

    public Issue assignUser(String username, int id) throws ResourceNotFoundException {
        User user = userService.getUser(username);
        Issue issue = issueDao.getIssue(id);
        issue.getAssignees().add(user);
        return issueDao.save(issue);
    }
}
