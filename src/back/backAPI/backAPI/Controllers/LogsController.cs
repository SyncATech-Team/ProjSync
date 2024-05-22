using backAPI.DTO;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers {
    [Authorize]
    public class LogsController : BaseApiController {
        
        private readonly ILogsRepository _logsRepository;
        private readonly IProjectsRepository _projectsRepository;

        public LogsController(
            ILogsRepository logsRepository,
            IProjectsRepository projectsRepository
        ) {
            _logsRepository = logsRepository;
            _projectsRepository = projectsRepository;
        }

        [HttpGet("count/{projectName}")]
        public async Task<ActionResult<int>> GetLogCount(string projectName) {

            var project = await _projectsRepository.GetProjectByName(projectName);
            if (project == null) {
                return BadRequest(new { message = "Project does not exist" });
            }

            var result = await _logsRepository.GetLogCount(project.Id);
            return result;
        }

        [HttpGet("logs/{projectName}")]
        public async Task<ActionResult<IEnumerable<LogDto>>> GetLogs(string projectName, int start, int end) {
            var project = await _projectsRepository.GetProjectByName(projectName);
            if (project == null) {
                return BadRequest(new { message = "Project does not exist" });
            }

            var result = await _logsRepository.GetLogs(project.Id, start, end);
            return result.ToList();
        }
    }
}
