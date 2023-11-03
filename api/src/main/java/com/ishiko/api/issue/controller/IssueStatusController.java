package com.ishiko.api.issue.controller;

import com.ishiko.api.issue.dto.IssueStatusDto;
import com.ishiko.api.issue.service.IssueService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/issue_status")
public class IssueStatusController {
    private final IssueService service;

    public IssueStatusController(IssueService service) {
        this.service = service;
    }

    @GetMapping
    public List<IssueStatusDto> getIssueStatuses() {
        return service.getIssueStatuses();
    }

}
