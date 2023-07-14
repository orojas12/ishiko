package app.ishiko.ishikoserver.issues;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface IssueRepository extends JpaRepository<Issue, Integer> {
    Set<Issue> findAllByProjectId(int projectId);
}
