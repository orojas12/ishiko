package com.ishiko.api.issue.repository;

import com.ishiko.api.issue.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Integer> {
//    int deleteById(int id);
}
