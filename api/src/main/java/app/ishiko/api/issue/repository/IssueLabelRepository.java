package app.ishiko.api.issue.repository;

import app.ishiko.api.issue.model.IssueLabel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueLabelRepository extends JpaRepository<IssueLabel, Integer> {
}
