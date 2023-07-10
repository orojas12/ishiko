package app.ishiko.ishikoserver.projects;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import app.ishiko.ishikoserver.users.User;
import app.ishiko.ishikoserver.users.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    ProjectRepository projectRepository;

    @Mock
    UserRepository userRepository;

    @AfterEach
    void resetMocks() {
        Mockito.reset(projectRepository, userRepository);
    }

    @Test
    void createProject_NewProject_savesProject() throws ResourceNotFoundException {
        ProjectRequest projectRequest = new ProjectRequest("title", "owner");
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArguments()[0]);
        when(userRepository.getByUsername(projectRequest.getOwner()))
                .thenReturn(Optional.of(new User(null, projectRequest.getOwner(), null)));
        ProjectService service = new ProjectService(projectRepository, userRepository);

        ProjectResponse response = service.createProject(projectRequest);
        assertThat(response.title()).isEqualTo(projectRequest.getTitle());
        assertThat(response.owner()).isEqualTo(projectRequest.getOwner());
    }

    @Test
    void createProject_NonExistentUsername_throwsResourceNotFoundException() {
        ProjectRequest projectRequest = new ProjectRequest(null, null);
        when(userRepository.getByUsername(projectRequest.getOwner()))
                .thenReturn(Optional.empty());
        ProjectService service = new ProjectService(projectRepository, userRepository);

        assertThatThrownBy(() -> service.createProject(projectRequest)).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getUserProjects_Username_returnsListOfProjectResponse() throws ResourceNotFoundException {
        Project project = new Project();
        project.setId(1);
        project.setTitle("title");
        User user = new User();
        user.setUsername("username");
        user.setProjects(List.of(project));
        when(userRepository.getByUsername(any())).thenReturn(Optional.of(user));
        ProjectService service = new ProjectService(projectRepository, userRepository);

        List<ProjectResponse> projects = service.getUserProjects(user.getUsername());
        assertThat(projects.size()).isEqualTo(1);
        ProjectResponse projectResponse = projects.get(0);
        assertThat(projectResponse.id()).isEqualTo(1);
        assertThat(projectResponse.title()).isEqualTo(project.getTitle());
        assertThat(projectResponse.owner()).isEqualTo(user.getUsername());
    }

    @Test
    void getUserProjects_NotFoundUsername_throwsResourceNotFoundException() {
        when(userRepository.getByUsername(any())).thenReturn(Optional.empty());
        ProjectService service = new ProjectService(projectRepository, userRepository);
        assertThatThrownBy(() -> service.getUserProjects("username"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}