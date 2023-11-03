package com.ishiko.api.issue.controller;

import com.ishiko.api.exceptions.HttpErrorResponseBodyDto;
import com.ishiko.api.exceptions.InvalidInputException;
import com.ishiko.api.exceptions.NotFoundException;
import com.ishiko.api.issue.dto.CreateOrUpdateIssueDto;
import com.ishiko.api.issue.dto.IssueDto;
import com.ishiko.api.issue.service.IssueService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/issue")
public class IssueController {

    private final IssueService service;

    public IssueController(IssueService service) {
        this.service = service;
    }

    @GetMapping
    public List<IssueDto> getIssues() {
        return service.getIssues();
    }

    @GetMapping("/{id}")
    public IssueDto getIssue(@PathVariable int id) throws NotFoundException {
        return service.getIssue(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IssueDto createIssue(@Valid @RequestBody CreateOrUpdateIssueDto dto) throws InvalidInputException {
        return service.createIssue(dto);
    }

    @PutMapping("/{id}")
    public IssueDto updateIssue(@PathVariable int id, @Valid @RequestBody CreateOrUpdateIssueDto dto)
            throws NotFoundException, InvalidInputException {
        return service.updateIssue(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIssue(@PathVariable int id) throws NotFoundException {
        service.deleteIssue(id);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException.class)
    public HttpErrorResponseBodyDto notFound(HttpServletRequest req, Exception e) {
        return new HttpErrorResponseBodyDto(e.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidInputException.class)
    public HttpErrorResponseBodyDto badRequest(HttpServletRequest req, Exception e) {
        return new HttpErrorResponseBodyDto(e.getMessage());
    }
}
