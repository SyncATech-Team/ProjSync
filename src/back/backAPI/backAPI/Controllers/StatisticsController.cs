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

        [HttpGet("taskpriorities/{projectName}")]
        public async Task<ActionResult<Dictionary<string, int>>> GetTaskPrioritiesForProject(string projectName) {

            var project = await _projectsRepository.GetProjectByName(projectName);
            if (project == null) {
                return BadRequest("There is not project with the given name");
            }

            var result = await _statisticsRepository.GetNumberOfTasksPerIssuePriorityProject(project.Id);

            return result;
        }

        [HttpGet("taskstatuses/{projectName}")]
        public async Task<ActionResult<Dictionary<string, int>>> GetTaskStatusesForProject(string projectName) {
            var project = await _projectsRepository.GetProjectByName(projectName);
            if (project == null) {
                return BadRequest("There is not project with the given name");
            }

            var result = await _statisticsRepository.GetNumberOfTasksPerIssueStatusInProject(project.Id);
            
            return result;
        }

        [HttpGet("taskgroups/{projectName}")]
        public async Task<ActionResult<Dictionary<string, int>>> GetTaskGroupsForProject(string projectName) {
            var project = await _projectsRepository.GetProjectByName(projectName);
            if (project == null) {
                return BadRequest("There is not project with the given name");
            }

            var result = await _statisticsRepository.GetNumberOfTasksPerGroupInProject(project.Id);

            return result;
        }

        [HttpGet("projectProgress/{projectName}")]
        public async Task<ActionResult<double>> GetProjectProgress(string projectName)
        {
            var project = await _projectsRepository.GetProjectByName(projectName);
            if (project == null)
            {
                return BadRequest("There is not project with the given name");
            }

            var result = await _statisticsRepository.CalculateProjectProgress(project.Id);
                    
            return result;
        }
    }
}
