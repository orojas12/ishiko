package app.ishiko.api.project.issue.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import app.ishiko.api.project.issue.dto.IssueLabelDto;
import app.ishiko.api.project.issue.service.IssueService;
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
