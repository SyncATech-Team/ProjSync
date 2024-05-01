using backAPI.Data;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers {
    public class StatisticsController : BaseApiController {

        private readonly IProjectsRepository _projectsRepository;
        private readonly IStatisticsRepository _statisticsRepository;

        public StatisticsController(
            IProjectsRepository projectsRepository,
            IStatisticsRepository statisticsRepository
        ) { 
            _projectsRepository = projectsRepository;
            _statisticsRepository = statisticsRepository;
        }

        [HttpGet("tasktypes/{projectName}")]
        public async Task<ActionResult<Dictionary<string, int>>> GetTaskTypesProportionForProject(string  projectName) {

            var project = await _projectsRepository.GetProjectByName(projectName);
            if(project == null) {
                return BadRequest("There is not project with the given name");
            }

            var result = await _statisticsRepository.GetNumberOfTasksPerIssueTypeInProject(project.Id);

            return result;
        }

    }
}
