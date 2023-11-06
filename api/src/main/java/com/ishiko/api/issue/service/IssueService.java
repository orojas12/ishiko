package com.ishiko.api.issue.service;

import com.ishiko.api.exceptions.InvalidInputException;
import com.ishiko.api.exceptions.NotFoundException;
import com.ishiko.api.issue.dto.CreateOrUpdateIssueDto;
import com.ishiko.api.issue.dto.IssueDto;
import com.ishiko.api.issue.dto.IssueLabelDto;
import com.ishiko.api.issue.dto.IssueStatusDto;
import com.ishiko.api.issue.model.Issue;
import com.ishiko.api.issue.model.IssueLabel;
import com.ishiko.api.issue.model.IssueStatus;
import com.ishiko.api.issue.repository.IssueLabelRepository;
import com.ishiko.api.issue.repository.IssueRepository;
import com.ishiko.api.issue.repository.IssueStatusRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final IssueStatusRepository issueStatusRepository;
    private final IssueLabelRepository issueLabelRepository;

    public IssueService(IssueRepository issueRepository, IssueStatusRepository issueStatusRepository,
                        IssueLabelRepository issueLabelRepository) {
        this.issueRepository = issueRepository;
        this.issueStatusRepository = issueStatusRepository;
        this.issueLabelRepository = issueLabelRepository;
    }

    public List<IssueDto> getIssues() {
        List<Issue> issues = issueRepository.findAllByOrderByCreatedDateDesc();
        return issues.stream().map(this::entityToDto).toList();
    }

    public List<IssueStatusDto> getIssueStatuses() {
        return issueStatusRepository.findAll().stream().map(this::entityToDto).toList();
    }

    public List<IssueLabelDto> getIssueLabels() {
        return issueLabelRepository.findAll().stream().map(this::entityToDto).toList();
    }

    public IssueDto getIssue(Integer id) throws NotFoundException {
        Optional<Issue> issueOptional = issueRepository.findById(id);
        if (issueOptional.isPresent()) {
            Issue issue = issueOptional.get();
            return entityToDto(issue);
        } else {
            throw new NotFoundException("Issue id " + id + " not found");
        }
    }

    public IssueDto createIssue(CreateOrUpdateIssueDto dto) throws InvalidInputException {
        Issue issue = new Issue();
        issue.setSubject(dto.getSubject());
        issue.setDescription(dto.getDescription());
        issue.setDueDate(dto.getDueDate().orElse(null));
        issue.setCreatedDate(Instant.now());
        Optional<IssueStatus> statusOptional = issueStatusRepository.findById(dto.getStatus());
        if (statusOptional.isPresent()) {
            issue.setStatus(statusOptional.get());
        } else throw new InvalidInputException("Issue status '" + dto.getStatus() + "' is invalid");
        if (dto.getLabel() != null) {
            Optional<IssueLabel> labelOptional = issueLabelRepository.findById(dto.getLabel());
            if (labelOptional.isPresent()) {
                issue.setLabel(labelOptional.get());
            } else throw new InvalidInputException("Issue label '" + dto.getLabel() + "' is invalid");
        }
        Issue savedIssue = issueRepository.save(issue);
        return entityToDto(savedIssue);
    }

    public IssueDto updateIssue(int id, CreateOrUpdateIssueDto dto) throws NotFoundException, InvalidInputException {
        Optional<Issue> optionalIssue = issueRepository.findById(id);
        if (optionalIssue.isPresent()) {
            Issue issue = optionalIssue.get();
            issue.setSubject(dto.getSubject());
            issue.setDescription(dto.getDescription());
            issue.setDueDate(dto.getDueDate().orElse(null));
            Optional<IssueStatus> statusOptional = issueStatusRepository.findById(dto.getStatus());
            if (statusOptional.isPresent()) {
                issue.setStatus(statusOptional.get());
            } else {
                throw new InvalidInputException("Issue status '" + dto.getStatus() + "' is invalid");
            }
            if (dto.getLabel() != null) {
                Optional<IssueLabel> labelOptional = issueLabelRepository.findById(dto.getLabel());
                if (labelOptional.isPresent()) {
                    issue.setLabel(labelOptional.get());
                } else {
                    throw new InvalidInputException("Issue label '" + dto.getLabel() + "' is invalid");
                }
            } else {
                issue.setLabel(null);
            }
            Issue savedIssue = issueRepository.save(issue);
            return entityToDto(savedIssue);
        } else throw new NotFoundException("Issue id '" + id + "' not found");
    }

    public void deleteIssue(int id) throws NotFoundException {
        Optional<Issue> optionalIssue = issueRepository.findById(id);
        if (optionalIssue.isPresent()) {
            issueRepository.delete(optionalIssue.get());
        } else {
            throw new NotFoundException("Issue id '" + id + "' not found");
        }
    }

    public IssueDto entityToDto(Issue issue) {
        IssueDto issueDto = new IssueDto();
        issueDto.setId(issue.getId());
        issueDto.setSubject(issue.getSubject());
        issueDto.setDescription(issue.getDescription());
        issueDto.setCreatedDate(issue.getCreatedDate());
        issueDto.setDueDate(issue.getDueDate().orElse(null));
        issueDto.setStatus(entityToDto(issue.getStatus()));
        issueDto.setLabel(entityToDto(issue.getLabel()));
        return issueDto;
    }

    public IssueStatusDto entityToDto(IssueStatus status) {
        return new IssueStatusDto(status.getId(), status.getName());
    }

    public IssueLabelDto entityToDto(IssueLabel label) {
        return new IssueLabelDto(label.getId(), label.getName());
    }
}
