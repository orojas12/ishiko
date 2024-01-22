package app.ishiko.api.project;

import app.ishiko.api.exception.InvalidInputException;
import app.ishiko.api.exception.NotFoundException;
import app.ishiko.api.project.issue.controller.IssueController;
import app.ishiko.api.project.issue.dto.CreateIssueDto;
import app.ishiko.api.project.issue.dto.CreateIssueRequest;
import app.ishiko.api.project.issue.dto.IssueDto;
import app.ishiko.api.project.issue.dto.IssueLabelDto;
import app.ishiko.api.project.issue.dto.IssueStatusDto;
import app.ishiko.api.project.issue.service.IssueService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(IssueController.class)
class IssueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IssueService issueService;

    /*
    @Test
    void updateIssue_UpdateIssueDto_ReturnsHttp200AndUpdatedData() throws Exception {
        int id = 1;
        var updateDto = new CreateIssueDto("subject", "desc", Instant.now(), 2, 3);
        var issueDto =
                new IssueDto(id, updateDto.getSubject(), updateDto.getDescription().orElseThrow(),
                        Instant.now(), updateDto.getDueDate().orElse(null), "project_1", "oscar",
                        new IssueStatusDto(updateDto.getStatus().orElseThrow(), "status"),
                        new IssueLabelDto(updateDto.getLabel().orElseThrow(), "label"));
        String json = objectMapper.writeValueAsString(updateDto);
        when(issueService.updateIssue(eq(issueDto.getId()), any())).thenReturn(issueDto);
        mockMvc.perform(
                put("/issue/{id}", id).contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpectAll(status().isOk(), jsonPath("$.id", is(issueDto.getId())),
                        jsonPath("$.subject", is(issueDto.getSubject())),
                        jsonPath("$.description", is(issueDto.getDescription())),
                        jsonPath("$.createdDate", is(issueDto.getCreateDate().toString())),
                        jsonPath("$.dueDate", is(issueDto.getDueDate().orElseThrow().toString())),
                        jsonPath("$.status.id", is(issueDto.getStatus().orElseThrow().getId())),
                        jsonPath("$.status.name", is(issueDto.getStatus().orElseThrow().getName())),
                        jsonPath("$.label.id", is(issueDto.getLabel().orElseThrow().getId())),
                        jsonPath("$.label.name", is(issueDto.getLabel().orElseThrow().getName())));
    }

    @Test
    void updateIssue_InvalidUpdateIssueDto_ReturnsHttp400AndErrorData() throws Exception {
        int id = 1;
        var invalidDto = new CreateIssueDto(null, "desc", Instant.now(), 1, 3);
        String json = objectMapper.writeValueAsString(invalidDto);
        when(issueService.updateIssue(eq(id), any())).thenReturn(null);
        mockMvc.perform(
                put("/issue/{id}", id).contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpectAll(status().isBadRequest());
    }

    @Test
    void updateIssue_UpdateIssueDto_ReturnsHttp400AndErrorDataIfInvalidInputException()
            throws Exception {
        int id = 1;
        var updateDto = new CreateIssueDto("subject", "desc", Instant.now(), 2, 3);
        var exc = new InvalidInputException("invalid");
        String json = objectMapper.writeValueAsString(updateDto);
        when(issueService.updateIssue(eq(id), any())).thenThrow(exc);
        mockMvc.perform(
                put("/issue/{id}", id).contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpectAll(status().isBadRequest(), jsonPath("$.message", is(exc.getMessage())));
    }

    @Test
    void deleteIssue_IssueId_ReturnsHttp204() throws Exception {
        int id = 1;
        doNothing().when(issueService).deleteIssue(id);
        mockMvc.perform(delete("/issue/{id}", id)).andExpectAll(status().isNoContent());
    }

    @Test
    void deleteIssue_NotFoundId_ReturnsHttp404AndErrorData() throws Exception {
        int id = 1;
        var exc = new NotFoundException("not found");
        doThrow(exc).when(issueService).deleteIssue(id);
        mockMvc.perform(delete("/issue/{id}", id)).andExpectAll(status().isNotFound());
    }
    */
}
