package app.ishiko.ishikoserver.issues;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class IssueDaoTest {

    @Mock
    IssueRepository issueRepository;

    @Test
    void getIssue_IssueId_returnsIssueIfExists() throws ResourceNotFoundException {
        Issue issue1 = new Issue();
        when(issueRepository.findById(any())).thenReturn(Optional.of(issue1));
        IssueDao issueDao = new IssueDao(issueRepository);
        Issue issue2 = issueDao.getById(0);
        assertThat(issue2).isEqualTo(issue1);
    }

    @Test
    void getIssue_IssueId_throwsResourceNotFoundExceptionIfNotExists() {
        when(issueRepository.findById(any())).thenReturn(Optional.empty());
        IssueDao issueDao = new IssueDao(issueRepository);
        assertThatThrownBy(() -> issueDao.getById(0)).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void save_Issue_savesIssueToRepository() {
        Issue issue = new Issue();
        IssueDao issueDao = new IssueDao(issueRepository);
        issueDao.save(issue);
        verify(issueRepository).save(issue);
    }

    @Test
    void save_Issue_returnsSavedIssue() {
        Issue issue = new Issue();
        issue.setId(0);
        when(issueRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        IssueDao issueDao = new IssueDao(issueRepository);
        Issue savedIssue = issueDao.save(issue);
        assertThat(savedIssue.getId()).isEqualTo(0);
    }

    @Test
    void delete_IssueId_deletesIssue() {
        IssueDao issueDao = new IssueDao(issueRepository);
        issueDao.deleteById(0);
        verify(issueRepository).deleteById(0);
    }

    @Test
    void existsById_IssueId_checksIfIssueExists() {
        IssueDao issueDao = new IssueDao(issueRepository);
        issueDao.existsById(0);
        verify(issueRepository).existsById(0);
    }
}
