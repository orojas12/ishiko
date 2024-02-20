package app.ishiko.api.project;

import static org.hamcrest.Matchers.is;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import app.ishiko.api.project.issue.model.IssueLabel;
import app.ishiko.api.project.issue.model.IssueStatus;
import app.ishiko.api.user.AppUser;

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.yml")
public class ProjectIT {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserDetailsManager manager;

    private Project testProject;

    private final String BASE_URL = "/resource/projects";

    void setUpTestData() {
        UserBuilder user = User.builder();
        user.username("test_user").password("{noop}password")
                .authorities("ROLE_USER");
        manager.createUser(user.build());
        AppUser owner =
                new AppUser("test_user");
        Project project = new Project("project_test", "name", "desc", owner);
        List<IssueStatus> statuses =
                List.of(new IssueStatus("in progress", project),
                        new IssueStatus("done", project));
        List<IssueLabel> labels = List.of(new IssueLabel("bug", project),
                new IssueLabel("feature", project));
        project.setIssueStatuses(statuses);
        project.setIssueLabels(labels);
        assertThat(project.getIssueStatuses().size()).isEqualTo(2);
        assertThat(project.getIssueLabels().size()).isEqualTo(2);
        projectRepository.saveAndFlush(project);
        testProject = project;
    }

    void tearDownTestData() {
        manager.deleteUser("test_user");
    }

    @Test
    void getProjectData() throws Exception {
        setUpTestData();
        mockMvc.perform(get(BASE_URL + "/{projectId}", testProject.getId())
                .with(user("test_user"))).andDo(print())
                .andExpectAll(status().isOk(),
                        jsonPath("$.id", is(testProject.getId())),
                        jsonPath("$.name", is(testProject.getName())),
                        jsonPath("$.description",
                                is(testProject.getDescription())),
                        jsonPath("$.owner",
                                is(testProject.getOwner().getUsername())),
                        jsonPath("$.statuses[0].id",
                                is(testProject.getIssueStatuses().get(0)
                                        .getId())),
                        jsonPath("$.statuses[0].name",
                                is(testProject.getIssueStatuses().get(0)
                                        .getName())),
                        jsonPath("$.statuses[1].id",
                                is(testProject.getIssueStatuses().get(1)
                                        .getId())),
                        jsonPath("$.statuses[1].name",
                                is(testProject.getIssueStatuses().get(1)
                                        .getName())),
                        jsonPath("$.labels[0].id",
                                is(testProject.getIssueLabels().get(0)
                                        .getId())),
                        jsonPath("$.labels[0].name",
                                is(testProject.getIssueLabels().get(0)
                                        .getName())),
                        jsonPath("$.labels[1].id",
                                is(testProject.getIssueLabels().get(1)
                                        .getId())),
                        jsonPath("$.labels[1].name", is(testProject
                                .getIssueLabels().get(1).getName())));
        tearDownTestData();
    }
}
