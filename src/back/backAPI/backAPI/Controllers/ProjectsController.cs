

using backAPI.DTO;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    public class ProjectsController : BaseApiController
    {
        private readonly IProjectsRepository _projectsRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IProjectTypesRepository _projectTypesRepository;
        private readonly IProjectVisibilitiesRepository _projectVisibilitiesRepository;

        public ProjectsController(IProjectsRepository projectsRepository, IUsersRepository usersRepository,
            IProjectTypesRepository projectTypesRepository, IProjectVisibilitiesRepository projectVisibilitiesRepository)
        {
            _projectsRepository = projectsRepository;
            _usersRepository = usersRepository;
            _projectTypesRepository = projectTypesRepository;
            _projectVisibilitiesRepository = projectVisibilitiesRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAllProjects()
        {
            var projects = await _projectsRepository.GetProjectsAsync();
            List<ProjectDto> result = new List<ProjectDto>();
            foreach (var project in projects)
            {
                var type = await _projectTypesRepository.GetProjectTypeById(project.TypeId);
                var visibility = await _projectVisibilitiesRepository.GetProjectVisibilityByIdAsync(project.VisibilityId);
                var owner = await _usersRepository.IdToUsername(project.OwnerId);

                result.Add(new ProjectDto {
                    Name = project.Name,
                    Key = project.Key,
                    TypeName = type.Name,
                    Description = project.Description,
                    CreationDate = project.CreationDate,
                    DueDate = project.DueDate,
                    OwnerUsername = owner,
                    ParentId = project.ParentId,
                    Budget = project.Budget,
                    VisibilityName = visibility.Name
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

            await _projectsRepository.CreateProject(projectDto);

            return Ok();
        }

        [HttpPut("{name}")]
        public async Task<ActionResult<string>> UpdateProject(string name,ProjectDto request)
        {
            var updated = await _projectsRepository.UpdateProject(name, request);

            if(updated == false)
            {
                return NotFound("There is no project whit specified name");
            }

            return Ok();
        }




        [HttpDelete("{name}")]
        public async Task<ActionResult<string>> DeleteProject(string name)
        {
            var deleted = await _projectsRepository.DeleteProject(name);

            if(deleted == false)
            {
                return NotFound("There is no project whit specified name");
            }
            return Ok();
        }
    }
}
