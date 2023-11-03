package com.ishiko.api.issue.repository;

import com.ishiko.api.issue.model.IssueLabel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueLabelRepository extends JpaRepository<IssueLabel, Integer> {
}
