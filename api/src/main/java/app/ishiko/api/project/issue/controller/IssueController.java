package app.ishiko.api.project.issue.controller;

import app.ishiko.api.exception.HttpErrorResponseBodyDto;
import app.ishiko.api.exception.InvalidInputException;
import app.ishiko.api.exception.NotFoundException;
import app.ishiko.api.project.issue.dto.CreateIssueDto;
import app.ishiko.api.project.issue.dto.CreateIssueRequest;
import app.ishiko.api.project.issue.dto.IssueDto;
import app.ishiko.api.project.issue.dto.UpdateIssueDto;
import app.ishiko.api.project.issue.service.IssueService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
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
        return service.getIssues("project_1");
    }

    @GetMapping("/{id}")
    public IssueDto getIssue(@PathVariable int id) throws NotFoundException {
        return service.getIssue(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IssueDto createIssue(Authentication auth, @Valid @RequestBody CreateIssueRequest dto)
            throws InvalidInputException {
        CreateIssueDto createIssueDto = new CreateIssueDto();
        createIssueDto.setSubject(dto.getSubject());
        createIssueDto.setDescription(dto.getDescription());
        createIssueDto.setDueDate(dto.getDueDate());
        createIssueDto.setProject(dto.getProject());
        createIssueDto.setStatus(dto.getStatus());
        createIssueDto.setLabel(dto.getLabel());
        createIssueDto.setAuthor((String) auth.getPrincipal());
        return service.createIssue(createIssueDto);
    }

    @PutMapping("/{id}")
    public IssueDto updateIssue(Authentication auth, @PathVariable int id,
            @Valid @RequestBody CreateIssueRequest dto)
            throws NotFoundException, InvalidInputException {
        UpdateIssueDto updateIssueDto = new UpdateIssueDto();
        updateIssueDto.setSubject(dto.getSubject());
        updateIssueDto.setDescription(dto.getDescription());
        updateIssueDto.setDueDate(dto.getDueDate());
        updateIssueDto.setStatus(dto.getStatus());
        updateIssueDto.setLabel(dto.getLabel());
        return service.updateIssue(updateIssueDto, (String) auth.getPrincipal());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIssue(Authentication auth, @PathVariable int id) throws NotFoundException {
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
