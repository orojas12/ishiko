package app.ishiko.ishikoserver.features.projects;

import app.ishiko.ishikoserver.security.user.User;
import app.ishiko.ishikoserver.security.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<ProjectResponse> getUserProjects(String username) throws ResourceNotFoundException {
        List<Project> projects;
        Optional<User> user = userRepository.getByUsername(username);
        if (user.isPresent()) {
            projects = user.get().getProjects();
        } else {
            throw new ResourceNotFoundException("Username not found");
        }
        return projects.stream()
                .map(project -> new ProjectResponse(
                        project.getId(), project.getTitle(), user.get().getUsername()
                ))
                .toList();
    }

    public ProjectResponse createProject(ProjectRequest projectRequest) throws ResourceNotFoundException {
        Project newProject;
        Optional<User> user = userRepository.getByUsername(projectRequest.getOwner());
        if (user.isPresent()) {
            newProject = new Project(projectRequest.getTitle().trim(), user.get());
            newProject = projectRepository.save(newProject);
        } else {
            throw new ResourceNotFoundException("Username not found");
        }
        return new ProjectResponse(newProject.getId(), newProject.getTitle(), newProject.getOwner().getUsername());
    }
}
