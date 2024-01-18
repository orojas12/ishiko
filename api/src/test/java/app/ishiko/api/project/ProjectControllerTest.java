package app.ishiko.api.project;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isA;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import app.ishiko.api.exception.NotFoundException;
import app.ishiko.api.project.issue.dto.IssueDto;
import app.ishiko.api.project.issue.dto.IssueLabelDto;
import app.ishiko.api.project.issue.dto.IssueStatusDto;
import app.ishiko.api.project.issue.service.IssueService;

@WebMvcTest(ProjectController.class)
public class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ProjectRepository projectRepository;
    @MockBean
    private IssueService issueService;

    @Test
    @WithMockUser(value = "john")
    void getProjectIssues_ProjectId_returnsHttp200AndIssues() throws Exception {
        String username = "john";
        Project project = new Project("project_1", "name", null);
        IssueDto dto = new IssueDto(1, "subject", "desc", Instant.now(),
                Instant.now(), "project_1", username,
                new IssueStatusDto(2, "status"), new IssueLabelDto(3, "label"));
        List<IssueDto> issues = List.of(dto);
        when(projectRepository.findByIdAndUser_Username(project.getId(),
                username)).thenReturn(Optional.of(project));
        when(issueService.getIssues(project.getId())).thenReturn(issues);

        mockMvc.perform(get("/projects/{projectId}/issues", project.getId()))
                .andExpectAll(status().isOk(),
                        jsonPath("$[0].id", is(issues.get(0).getId())),
                        jsonPath("$[0].subject",
                                is(issues.get(0).getSubject())),
                        jsonPath("$[0].description",
                                is(issues.get(0).getDescription().get())),
                        jsonPath("$[0].createDate",
                                is(issues.get(0).getCreateDate().toString())),
                        jsonPath("$[0].dueDate",
                                is(issues.get(0).getDueDate().orElseThrow()
                                        .toString())),
                        jsonPath("$[0].status.id",
                                is(issues.get(0).getStatus().orElseThrow()
                                        .getId())),
                        jsonPath("$[0].status.name",
                                is(issues.get(0).getStatus().orElseThrow()
                                        .getName())),
                        jsonPath("$[0].label.id",
                                is(issues.get(0).getLabel().orElseThrow()
                                        .getId())),
                        jsonPath("$[0].label.name", is(issues.get(0).getLabel()
                                .orElseThrow().getName())));
    }

    @Test
    @WithMockUser(value = "john")
    void getProjectIssues_NonExistentProjectId_returnsHttp404AndErrorMsg()
            throws Exception {
        String username = "john";
        Project project = new Project("project_1", "name", null);
        IssueDto dto = new IssueDto(1, "subject", "desc", Instant.now(),
                Instant.now(), "project_1", username,
                new IssueStatusDto(2, "status"), new IssueLabelDto(3, "label"));
        List<IssueDto> issues = List.of(dto);
        when(projectRepository.findByIdAndUser_Username(project.getId(),
                username)).thenReturn(Optional.empty());
        when(issueService.getIssues(project.getId())).thenReturn(issues);

        mockMvc.perform(get("/projects/{projectId}/issues", project.getId()))
                .andExpectAll(status().isNotFound(), jsonPath("$.message", isA(String.class)));
    }

    @Test
    @WithMockUser(value = "john")
    void getProjectIssue_ProjectIdAndIssueId_returnsHttp200AndIssue()
            throws Exception, NotFoundException {
        String username = "john";
        Project project = new Project("project_1", "name", null);
        IssueDto dto = new IssueDto(1, "subject", "desc", Instant.now(),
                Instant.now(), "project_1", username,
                new IssueStatusDto(2, "status"), new IssueLabelDto(3, "label"));
        when(projectRepository.findByIdAndUser_Username(project.getId(),
                username)).thenReturn(Optional.of(project));
        when(issueService.getIssue(dto.getId())).thenReturn(dto);

        mockMvc.perform(get("/projects/{projectId}/issues/{issueId}",
                project.getId(), dto.getId()))
                .andExpectAll(jsonPath("$.id", is(dto.getId())),
                        jsonPath("$.subject", is(dto.getSubject())),
                        jsonPath("$.description",
                                is(dto.getDescription().orElseThrow())),
                        jsonPath("$.createDate",
                                is(dto.getCreateDate().toString())),
                        jsonPath("$.dueDate",
                                is(dto.getDueDate().orElseThrow().toString())),
                        jsonPath("$.project", is(dto.getProject())),
                        jsonPath("$.author", is(dto.getAuthor())),
                        jsonPath("$.status.id",
                                is(dto.getStatus().orElseThrow().getId())),
                        jsonPath("$.status.name",
                                is(dto.getStatus().orElseThrow().getName())),
                        jsonPath("$.label.id",
                                is(dto.getLabel().orElseThrow().getId())),
                        jsonPath("$.label.name",
                                is(dto.getLabel().orElseThrow().getName())));
    }

    @Test
    @WithMockUser(value = "john")
    void getProjectIssue_NonExistentProjectId_returnsHttp404() throws Exception {
        String username = "john";
        Project project = new Project("project_1", "name", null);
        IssueDto dto = new IssueDto(1, "subject", "desc", Instant.now(),
                Instant.now(), "project_1", username,
                new IssueStatusDto(2, "status"), new IssueLabelDto(3, "label"));
        when(projectRepository.findByIdAndUser_Username(project.getId(),
                username)).thenReturn(Optional.empty());
        when(issueService.getIssue(dto.getId())).thenReturn(dto);
        mockMvc.perform(get("/projects/{projectId}/issues", project.getId()))
                .andExpectAll(status().isNotFound(), jsonPath("$.message", isA(String.class)));
    }
}
