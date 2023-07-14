package app.ishiko.ishikoserver.issues;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class IssueDao {

    private final IssueRepository repository;

    public IssueDao(IssueRepository repository) {
        this.repository = repository;
    }

    public Issue getById(int id) throws ResourceNotFoundException {
        Issue issue;
        Optional<Issue> issueOptional = repository.findById(id);
        if (issueOptional.isPresent()) {
            issue = issueOptional.get();
        } else {
            throw new ResourceNotFoundException("Issue id '" + id + "' not found");
        }
        return issue;
    }

    public Set<Issue> getAllByProjectId(int projectId) {
        return repository.findAllByProjectId(projectId);
    }

    public Issue save(Issue issue) {
        return repository.save(issue);
    }

    public void deleteById(int issueId) {
        repository.deleteById(issueId);
    }

    public boolean existsById(int issueId) {
        return repository.existsById(issueId);
    }
}
