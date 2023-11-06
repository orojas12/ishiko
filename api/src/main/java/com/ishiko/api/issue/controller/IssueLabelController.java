package com.ishiko.api.issue.controller;

import com.ishiko.api.issue.dto.IssueLabelDto;
import com.ishiko.api.issue.service.IssueService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/issue_label")
public class IssueLabelController {
    private final IssueService service;

    public IssueLabelController(IssueService service) {
        this.service = service;
    }

    @GetMapping
    public List<IssueLabelDto> getIssueLabels() {
        return service.getIssueLabels();
    }
}
