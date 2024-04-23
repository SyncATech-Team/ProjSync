using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    [Route("api/")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        
        private readonly IProjectDocumentationRepository docsRepository;
        private readonly IProjectsRepository projectsRepository;


        public DocumentsController(
            IProjectDocumentationRepository docsRepository,
            IProjectsRepository projectsRepository)
        { 
        
            this.docsRepository = docsRepository;
            this.projectsRepository = projectsRepository;

        }

        [HttpPost("project-documentation/{projectName}")]
        public async Task<ActionResult> UploadDocument(string projectName, List<IFormFile> files) {
            var project = await projectsRepository.GetProjectByName(projectName);
            if (project == null) {
                return BadRequest("There is no project with the given name");
            }

            // proveri da li postoji direktorijum u koji zelimo da sacuvamo fajl
            // kreirati direktorijum za skladistenje dokumenata
            if(docsRepository.ProjectDocumentationDirectoryExist() == false) {
                Directory.CreateDirectory("../project-documentation");
            }

            var result = await docsRepository.WriteMultipleFilesAsync(project.Id, files);
            if(result != "OK") {
                return BadRequest($"Failed to upload documents: {result}");
            }

            return Ok();
        }

    }
}
