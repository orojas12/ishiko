package app.ishiko.api.project.issue.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import app.ishiko.api.project.issue.dto.IssueStatusDto;
import app.ishiko.api.project.issue.service.IssueService;
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
