

using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class ProjectsController : BaseApiController
    {
        private readonly IProjectsRepository _projectsRepository;

        public ProjectsController(IProjectsRepository projectsRepository)
        {
            _projectsRepository = projectsRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAllProjects()
        {
            var projects = await _projectsRepository.GetProjectsAsync();
            List<ProjectDto> result = new List<ProjectDto>();
            foreach (var project in projects)
            {
                result.Add(new ProjectDto {
                    Name = project.Name,
                    Key = project.Key,
                    TypeId = project.TypeId,
                    Description = project.Description,
                    CreationDate = project.CreationDate,
                    DueDate = project.DueDate,
                    OwnerId = project.OwnerId,
                    ParentId = project.ParentId,
                    Budget = project.Budget,
                    VisibilityId = project.VisibilityId
                });
            }
            return result;
        }
        [HttpPost]
        public async Task<ActionResult> CreateProject(ProjectDto projectDto)
        {

            if(await _projectsRepository.ProjectExistsByName(projectDto.Name))
            {
                return BadRequest("Project name is taken");
            }

            if(await _projectsRepository.ProjectExistsByKey(projectDto.Key))
            {
                return BadRequest("Project key is taken");
            }

            var project = new Project
            {
                Name = projectDto.Name,
                Key = projectDto.Key,
                Description = projectDto.Description,
                CreationDate = projectDto.CreationDate,
                DueDate = projectDto.DueDate,
                OwnerId = projectDto.OwnerId,
                ParentId = projectDto.ParentId,
                Budget = projectDto.Budget,
                VisibilityId = projectDto.VisibilityId,
                TypeId = projectDto.TypeId
            };

            await _projectsRepository.CreateProject(project);

            return Ok();
        }
    }
}
