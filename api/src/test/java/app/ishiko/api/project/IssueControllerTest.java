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

    @Test
    void getIssues() throws Exception {
        var dto = new IssueDto(1, "subject", "desc", Instant.now(), Instant.now(), "project_1",
                "oscar", new IssueStatusDto(2, "status"), new IssueLabelDto(3, "label"));
        List<IssueDto> issues = List.of(dto);
        when(issueService.getIssues("project_1")).thenReturn(issues);
        mockMvc.perform(get("/issue")).andExpectAll(status().isOk(),
                jsonPath("$[0].id", is(dto.getId())),
                jsonPath("$[0].subject", is(dto.getSubject())),
                jsonPath("$[0].description", is(dto.getDescription())),
                jsonPath("$[0].createdDate", is(dto.getCreateDate().toString())),
                jsonPath("$[0].dueDate", is(dto.getDueDate().orElseThrow().toString())),
                jsonPath("$[0].status.id", is(dto.getStatus().orElseThrow().getId())),
                jsonPath("$[0].status.name", is(dto.getStatus().orElseThrow().getName())),
                jsonPath("$[0].label.id", is(dto.getLabel().orElseThrow().getId())),
                jsonPath("$[0].label.name", is(dto.getLabel().orElseThrow().getName())));
    }

    @Test
    void getIssue_IssueId_ReturnsHttp200AndIssueData() throws Exception {
        var dto = new IssueDto(1, "subject", "desc", Instant.now(), Instant.now(), "project_1",
                "oscar", new IssueStatusDto(2, "status"), new IssueLabelDto(3, "label"));
        when(issueService.getIssue(dto.getId())).thenReturn(dto);
        mockMvc.perform(get("/issue/{id}", dto.getId())).andExpectAll(status().isOk(),
                jsonPath("$.id", is(dto.getId())), jsonPath("$.subject", is(dto.getSubject())),
                jsonPath("$.description", is(dto.getDescription())),
                jsonPath("$.createdDate", is(dto.getCreateDate().toString())),
                jsonPath("$.dueDate", is(dto.getDueDate().orElseThrow().toString())),
                jsonPath("$.status.id", is(dto.getStatus().orElseThrow().getId())),
                jsonPath("$.status.name", is(dto.getStatus().orElseThrow().getName())),
                jsonPath("$.label.id", is(dto.getLabel().orElseThrow().getId())),
                jsonPath("$.label.name", is(dto.getLabel().orElseThrow().getName())));
    }

    @Test
    void getIssue_NotFoundId_ReturnsHttp404AndErrorData() throws Exception {
        int id = 1;
        NotFoundException exc = new NotFoundException("not found");
        when(issueService.getIssue(id)).thenThrow(exc);
        mockMvc.perform(get("/issue/{id}", id)).andExpectAll(status().isNotFound(),
                jsonPath("$.message", is(exc.getMessage())));
    }

    @Test
    void createIssue_CreateIssueDto_ReturnsHttp201AndCreatedData() throws Exception {
        var createDto = new CreateIssueRequest("subject", "desc", Instant.now(), "project_1", 2, 3);
        var issueDto = new IssueDto(1, createDto.getSubject(), createDto.getDescription(),
                Instant.now(), createDto.getDueDate(), "project_1", "oscar",
                new IssueStatusDto(createDto.getStatus(), "status"),
                new IssueLabelDto(createDto.getLabel(), "label"));
        String json = objectMapper.writeValueAsString(createDto);
        when(issueService.createIssue(any())).thenReturn(issueDto);
        mockMvc.perform(post("/issue").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpectAll(status().isCreated(), jsonPath("$.id", is(issueDto.getId())),
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
    void createIssue_InvalidCreateIssueDto_ReturnsHttp400AndErrorData() throws Exception {
        var invalidDto = new CreateIssueRequest(null, "desc", Instant.now(), "project_1", 1, 3);
        String json = objectMapper.writeValueAsString(invalidDto);
        when(issueService.createIssue(any())).thenReturn(null);
        mockMvc.perform(post("/issue").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpectAll(status().isBadRequest());
    }

    @Test
    void createIssue_CreateIssueDto_ReturnsHttp400AndErrorDataIfInvalidInputException()
            throws Exception {
        var createDto = new CreateIssueDto("subject", "desc", Instant.now(), 2, 3);
        var exc = new InvalidInputException("invalid");
        String json = objectMapper.writeValueAsString(createDto);
        when(issueService.createIssue(any())).thenThrow(exc);
        mockMvc.perform(post("/issue").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpectAll(status().isBadRequest(), jsonPath("$.message", is(exc.getMessage())));
    }

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
}
