package app.ishiko.ishikoserver.issues;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class IssueDao {

    private final IssueRepository repository;

    public IssueDao(IssueRepository repository) {
        this.repository = repository;
    }

    public Issue getIssue(int id) throws ResourceNotFoundException {
        Issue issue;
        Optional<Issue> issueOptional = repository.findById(id);
        if (issueOptional.isPresent()) {
            issue = issueOptional.get();
        } else {
            throw new ResourceNotFoundException("Issue id '" + id + "' not found");
        }
        return issue;
    }

    public Issue save(Issue issue) {
        return repository.save(issue);
    }
}
