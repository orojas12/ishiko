package com.ishiko.api.issue.repository;

import com.ishiko.api.issue.model.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueStatusRepository extends JpaRepository<IssueStatus, Integer> {
}
