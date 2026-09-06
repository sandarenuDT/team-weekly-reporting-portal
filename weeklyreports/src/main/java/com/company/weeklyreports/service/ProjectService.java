package com.company.weeklyreports.service;

import com.company.weeklyreports.dto.request.ProjectRequest;
import com.company.weeklyreports.dto.response.ProjectResponse;
import com.company.weeklyreports.entity.Project;
import com.company.weeklyreports.exception.ResourceNotFoundException;
import com.company.weeklyreports.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<ProjectResponse> findAllActive() {
        return projectRepository.findAll().stream()
                .filter(Project::isActive)
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse create(ProjectRequest request) {
        if (projectRepository.existsByNameIgnoreCase(request.getName())) {
            throw new IllegalStateException("A project with this name already exists.");
        }

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return toResponse(projectRepository.save(project));
    }

    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        return toResponse(projectRepository.save(project));
    }

    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));

        project.setActive(false);
        projectRepository.save(project);
    }

    private ProjectResponse toResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .isActive(project.isActive())
                .build();
    }
}