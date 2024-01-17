package app.ishiko.api.project.issue.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import app.ishiko.api.project.issue.model.IssueLabel;

public interface IssueLabelRepository extends JpaRepository<IssueLabel, Integer> {
}
