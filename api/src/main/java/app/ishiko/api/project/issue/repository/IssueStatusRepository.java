package app.ishiko.api.project.issue.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import app.ishiko.api.project.issue.model.IssueStatus;

public interface IssueStatusRepository extends JpaRepository<IssueStatus, Integer> {
}
