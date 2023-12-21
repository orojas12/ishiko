package app.ishiko.api.issue.repository;

import app.ishiko.api.issue.model.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueStatusRepository extends JpaRepository<IssueStatus, Integer> {
}
