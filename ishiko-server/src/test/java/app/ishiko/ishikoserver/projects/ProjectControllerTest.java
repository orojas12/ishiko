package app.ishiko.ishikoserver.projects;

import app.ishiko.ishikoserver.config.WebMvcTestConfiguration;
import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProjectController.class)
@Import(WebMvcTestConfiguration.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private ProjectService service;

    @Test
    void getProjects_Username_returnsListOfUserProjects() throws Exception {
        ProjectResponse projectResponse = new ProjectResponse(1, "title", "owner");
        List<ProjectResponse> projects = List.of(projectResponse);
        when(service.getUserProjects(any())).thenReturn(projects);

        mockMvc.perform(get("/projects").with(user("user")))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projects", hasSize(1)))
                .andExpect(jsonPath("$.projects[0].id", is(projectResponse.id())))
                .andExpect(jsonPath("$.projects[0].title", is(projectResponse.title())))
                .andExpect(jsonPath("$.projects[0].owner", is(projectResponse.owner())));
    }

    @Test
    void getProjects_NotFoundUsername_returnsHttpStatus404() throws Exception {
        when(service.getUserProjects(any())).thenThrow(ResourceNotFoundException.class);

        mockMvc.perform(get("/projects").with(user("user")))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void getProjects_Unauthenticated_returnsHttpStatus401() throws Exception {
        mockMvc.perform(get("/projects"))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createProject_Project_returnsCreatedProject() throws Exception {
        ProjectRequest project = new ProjectRequest();
        project.setTitle("title");
        ProjectResponse response = new ProjectResponse(1, project.getTitle(), "user");
        when(service.createProject(any())).thenReturn(response);

        mockMvc.perform(
                        post("/projects")
                                .with(csrf()).with(user("user"))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(project)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is(project.getTitle())))
                .andExpect(jsonPath("$.owner", is("user")));
    }

    @Test
    void createProject_InvalidCsrfToken_returnsHttpStatus401() throws Exception {
        mockMvc.perform(
                        post("/projects")
                                .with(user("user")))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void createProject_Unauthenticated_returnsHttpStatus401() throws Exception {
        mockMvc.perform(
                        post("/projects").with(csrf()))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }
}