package com.ishiko.api.issue;

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
import com.ishiko.api.issue.service.IssueService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class IssueServiceTest {

    @Mock
    private IssueRepository issueRepository;
    @Mock
    private IssueStatusRepository statusRepository;
    @Mock
    private IssueLabelRepository labelRepository;

    IssueService getIssueService() {
        return new IssueService(issueRepository, statusRepository, labelRepository);
    }

    @Test
    void getIssues_getsAllIssues() {
        var issue = new Issue(1, "title", "desc", Instant.now(), null);
        var status = new IssueStatus();
        var label = new IssueLabel();
        issue.setStatus(status);
        issue.setLabel(label);
        when(issueRepository.findAll()).thenReturn(
                List.of(issue));
        IssueService service = getIssueService();
        List<IssueDto> issueDtoList = service.getIssues();
        verify(issueRepository, times(1)).findAll();
        assertThat(issueDtoList.size()).isEqualTo(1);
    }

    @Test
    void getIssue_IssueId_getsIssueById() throws NotFoundException {
        Issue issue = new Issue(1, "title", "desc", Instant.now(), null);
        var status = new IssueStatus();
        var label = new IssueLabel();
        issue.setStatus(status);
        issue.setLabel(label);
        when(issueRepository.findById(issue.getId())).thenReturn(Optional.of(issue));
        IssueService service = getIssueService();
        IssueDto dto = service.getIssue(issue.getId());
        verify(issueRepository, times(1)).findById(issue.getId());
    }

    @Test
    void getIssue_NotFoundIssueId_throwsNotFoundException() {
        var id = 1;
        when(issueRepository.findById(id)).thenReturn(Optional.empty());
        IssueService service = getIssueService();
        assertThatThrownBy(() -> service.getIssue(1)).isInstanceOf(NotFoundException.class);
    }

    @Test
    void createIssue_CreateIssueDto_createsIssue() throws InvalidInputException {
        var dto = new CreateOrUpdateIssueDto("subject", "desc", null, 1, 2);
        var status = new IssueStatus(dto.getStatus(), "");
        var label = new IssueLabel(dto.getLabel(), "");
        when(statusRepository.findById(dto.getStatus())).thenReturn(Optional.of(status));
        when(labelRepository.findById(dto.getLabel())).thenReturn(Optional.of(label));
        when(issueRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        ArgumentCaptor<Issue> arg = ArgumentCaptor.forClass(Issue.class);
        IssueService service = getIssueService();
        IssueDto createdIssueDto = service.createIssue(dto);
        verify(issueRepository).save(arg.capture());
        assertThat(arg.getValue().getSubject()).isEqualTo(dto.getSubject());
        assertThat(arg.getValue().getDescription()).isEqualTo(dto.getDescription());
        assertThat(arg.getValue().getDueDate()).isEqualTo(dto.getDueDate());
        assertThat(arg.getValue().getStatus().getId()).isEqualTo(dto.getStatus());
        assertThat(arg.getValue().getLabel().getId()).isEqualTo(dto.getLabel());
    }

    @Test
    void createIssue_CreateIssueDtoWithInvalidStatus_throwsInvalidInputException() {
        var dto = new CreateOrUpdateIssueDto("subject", "desc", null, 1, 2);
        var label = new IssueLabel(dto.getLabel(), "");
        when(statusRepository.findById(dto.getStatus())).thenReturn(Optional.empty());
        IssueService service = getIssueService();
        assertThatThrownBy(() -> service.createIssue(dto)).isInstanceOf(InvalidInputException.class);
    }

    @Test
    void createIssue_CreateIssueDtoWithInvalidLabel_throwsInvalidInputException() {
        var dto = new CreateOrUpdateIssueDto("subject", "desc", null, 1, 2);
        var status = new IssueStatus(dto.getStatus(), "");
        when(statusRepository.findById(dto.getStatus())).thenReturn(Optional.of(status));
        when(labelRepository.findById(dto.getLabel())).thenReturn(Optional.empty());
        IssueService service = getIssueService();
        assertThatThrownBy(() -> service.createIssue(dto)).isInstanceOf(InvalidInputException.class);
    }

    @Test
    void updateIssue_UpdateIssueDto_updatesIssue() throws NotFoundException, InvalidInputException {
        int id = 1;
        var dto = new CreateOrUpdateIssueDto("subject", "desc", null, 1, 2);
        var status = new IssueStatus(dto.getStatus(), "");
        var label = new IssueLabel(dto.getLabel(), "");
        var issue = new Issue();
        when(statusRepository.findById(dto.getStatus())).thenReturn(Optional.of(status));
        when(labelRepository.findById(dto.getLabel())).thenReturn(Optional.of(label));
        when(issueRepository.findById(id)).thenReturn(Optional.of(issue));
        when(issueRepository.save(issue)).thenAnswer(i -> i.getArguments()[0]);
        ArgumentCaptor<Issue> arg = ArgumentCaptor.forClass(Issue.class);
        IssueService service = getIssueService();
        IssueDto createdIssueDto = service.updateIssue(id, dto);
        verify(issueRepository).save(arg.capture());
        assertThat(arg.getValue().getSubject()).isEqualTo(dto.getSubject());
        assertThat(arg.getValue().getDescription()).isEqualTo(dto.getDescription());
        assertThat(arg.getValue().getDueDate()).isEqualTo(dto.getDueDate());
        assertThat(arg.getValue().getStatus().getId()).isEqualTo(dto.getStatus());
        assertThat(arg.getValue().getLabel().getId()).isEqualTo(dto.getLabel());
    }

    @Test
    void updateIssue_NotFoundId_throwsNotFoundException() {
        int id = 1;
        var dto = new CreateOrUpdateIssueDto("subject", "desc", null, 1, 2);
        when(issueRepository.findById(id)).thenReturn(Optional.empty());
        IssueService service = getIssueService();
        assertThatThrownBy(() -> service.updateIssue(id, dto)).isInstanceOf(NotFoundException.class);
    }

    @Test
    void updateIssue_UpdateIssueDtoWithInvalidStatus_throwsInvalidInputException() {
        int id = 1;
        var dto = new CreateOrUpdateIssueDto("subject", "desc", null, 1, 2);
        var issue = new Issue();
        when(issueRepository.findById(anyInt())).thenReturn(Optional.of(issue));
        when(statusRepository.findById(dto.getStatus())).thenReturn(Optional.empty());
        IssueService service = getIssueService();
        assertThatThrownBy(() -> service.updateIssue(id, dto)).isInstanceOf(InvalidInputException.class);
    }

    @Test
    void updateIssue_UpdateIssueDtoWithInvalidLabel_throwsInvalidInputException() {
        int id = 1;
        var dto = new CreateOrUpdateIssueDto("subject", "desc", null, 1, 2);
        var issue = new Issue();
        var status = new IssueStatus(dto.getStatus(), "");
        when(issueRepository.findById(id)).thenReturn(Optional.of(issue));
        when(statusRepository.findById(dto.getStatus())).thenReturn(Optional.of(status));
        when(labelRepository.findById(dto.getLabel())).thenReturn(Optional.empty());
        IssueService service = getIssueService();
        assertThatThrownBy(() -> service.updateIssue(id, dto)).isInstanceOf(InvalidInputException.class);
    }

    @Test
    void deleteIssue_IssueId_deletesIssue() throws NotFoundException {
        var id = 1;
        var issue = new Issue();
        when(issueRepository.findById(id)).thenReturn(Optional.of(issue));
        IssueService service = getIssueService();
        service.deleteIssue(id);
        verify(issueRepository).delete(issue);
    }

    @Test
    void deleteIssue_NotFoundId_throwsNotFoundException() {
        var id = 1;
        when(issueRepository.findById(id)).thenReturn(Optional.empty());
        IssueService service = getIssueService();
        assertThatThrownBy(() -> service.deleteIssue(id)).isInstanceOf(NotFoundException.class);
    }

    @Test
    void entityToDto_Issue_returnsDtoWithSameData() {
        var status = new IssueStatus(1, "status");
        var label = new IssueLabel(2, "label");
        var issue = new Issue(3, "subject", "desc", Instant.now(), null, status, label);
        IssueService service = getIssueService();
        IssueDto dto = service.entityToDto(issue);
        assertThat(dto.getId()).isEqualTo(issue.getId());
        assertThat(dto.getSubject()).isEqualTo(issue.getSubject());
        assertThat(dto.getDescription()).isEqualTo(issue.getDescription());
        assertThat(dto.getCreatedDate()).isEqualTo(issue.getCreatedDate());
        assertThat(dto.getDueDate()).isEqualTo(issue.getDueDate());
        assertThat(dto.getStatus().getId()).isEqualTo(status.getId());
        assertThat(dto.getStatus().getName()).isEqualTo(status.getName());
        assertThat(dto.getLabel().getId()).isEqualTo(label.getId());
        assertThat(dto.getLabel().getName()).isEqualTo(label.getName());
    }

    @Test
    void entityToDto_IssueStatus_returnsDtoWithSameData() {
        var status = new IssueStatus(1, "status");
        IssueService service = getIssueService();
        IssueStatusDto dto = service.entityToDto(status);
        assertThat(dto.getId()).isEqualTo(status.getId());
        assertThat(dto.getName()).isEqualTo(status.getName());
    }

    @Test
    void entityToDto_IssueLabel_returnsDtoWithSameData() {
        var label = new IssueLabel(1, "label");
        IssueService service = getIssueService();
        IssueLabelDto dto = service.entityToDto(label);
        assertThat(dto.getId()).isEqualTo(label.getId());
        assertThat(dto.getName()).isEqualTo(label.getName());
    }
}
