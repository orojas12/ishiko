package app.ishiko.api.project.issue.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import app.ishiko.api.project.issue.model.Issue;
import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Integer> {
    List<Issue> findAllByOrderByCreateDateDesc();

    List<Issue> findAllByProject_IdOrderByCreateDateDesc(String id);
}
