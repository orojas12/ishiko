package app.ishiko.ishikoserver;

import app.ishiko.ishikoserver.config.IshikoServerApplicationITConfiguration;
import app.ishiko.ishikoserver.config.IshikoServerApplicationITConfiguration.UsernamePassword;
import app.ishiko.ishikoserver.features.projects.*;
import app.ishiko.ishikoserver.security.csrf.CsrfController.CsrfTokenResponse;
import app.ishiko.ishikoserver.security.user.User;
import app.ishiko.ishikoserver.security.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Import;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.net.URI;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Import({IshikoServerApplicationITConfiguration.class})
class IshikoServerApplicationIT {

    private final String url;
    private final TestRestTemplate restTemplate;
    private final UsernamePassword usernamePassword;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder encoder;

    @Autowired
    public IshikoServerApplicationIT(
            @Value("${local.server.port}") int port,
            TestRestTemplate restTemplate,
            UsernamePassword usernamePassword,
            UserRepository userRepository, ProjectRepository projectRepository, PasswordEncoder encoder) {
        this.url = "http://localhost:" + port;
        this.restTemplate = restTemplate;
        this.usernamePassword = usernamePassword;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.encoder = encoder;
    }

    private ResponseEntity<CsrfTokenResponse> csrf() {
        return restTemplate.getForEntity(url + "/csrf", CsrfTokenResponse.class);
    }

    private Session getSession() {
        ResponseEntity<CsrfTokenResponse> csrfResponse = csrf();
        String token = csrfResponse.getBody().token();
        String cookie = csrfResponse.getHeaders().get("Set-Cookie").get(0);
        var headers = new HttpHeaders();
        headers.set("X-CSRF-TOKEN", token);
        headers.set("Cookie", cookie);
        headers.setContentType(MediaType.APPLICATION_JSON);
        var request = new RequestEntity<UsernamePassword>(usernamePassword, headers,
                HttpMethod.POST, URI.create(url + "/login")
        );
        var response = restTemplate.postForEntity(url + "/login", request, Object.class);
        cookie = response.getHeaders().get("Set-Cookie").get(0);
        return new Session(cookie, token);
    }

    private HttpHeaders getSecureHeaders() {
        Session session = getSession();
        var headers = new HttpHeaders();
        headers.set("Cookie", session.sessionCookie());
        headers.set("X-CSRF-TOKEN", session.csrfToken());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    @BeforeEach
    void setUpTestData() {
        User user = new User("1", usernamePassword.username(), encoder.encode(usernamePassword.password()));
        Project project = new Project("title", user);
        user.setProjects(List.of(project));
        userRepository.save(user);
    }

    @AfterEach
    void tearDownTestData() {
        userRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    void getProjectsShouldReturnAllProjectsForThatUser() {
        HttpHeaders headers = getSecureHeaders();
        var request = new RequestEntity<>(headers, HttpMethod.GET, URI.create(url + "/projects"));
        ResponseEntity<ProjectListResponse> response = restTemplate.exchange(request, ProjectListResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<ProjectResponse> projects = response.getBody().projects();
        assertThat(projects.size()).isEqualTo(1);
        assertThat(projects.get(0).title()).isEqualTo("title");
        assertThat(projects.get(0).owner()).isEqualTo(usernamePassword.username());
    }

    @Test
    void createProjectShouldPersistProject() {
        projectRepository.deleteAll();
        HttpHeaders headers = getSecureHeaders();
        ProjectRequest newProject = new ProjectRequest();
        newProject.setTitle("title");
        var request = new RequestEntity<>(newProject, headers, HttpMethod.POST, URI.create(url + "/projects"));
        ResponseEntity<ProjectResponse> response = restTemplate.postForEntity(url + "/projects", request,
                ProjectResponse.class);
        ProjectResponse projectResponse = response.getBody();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        List<Project> projects = projectRepository.findAll();
        assertThat(projects.size()).isEqualTo(1);
        Project createdProject = projectRepository.findById(projectResponse.id()).get();
        // merge into session
        createdProject = projectRepository.save(createdProject);
        User owner = createdProject.getOwner();
        assertThat(createdProject.getTitle()).isEqualTo("title");
        assertThat(owner.getUsername()).isEqualTo(usernamePassword.username());
    }

    private record Session(String sessionCookie, String csrfToken) {
    }
}
