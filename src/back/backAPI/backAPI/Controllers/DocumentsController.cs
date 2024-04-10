using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    [Route("api/")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {

        private readonly IProjectDocumentationRepository repository;
        public DocumentsController(IProjectDocumentationRepository repository) { 
        
            this.repository = repository;

        }

        [HttpPost("project/{projectId}")]
        public ActionResult UploadDocument(int projectId, IFormFile documentFile)
        {
            if (documentFile == null || documentFile.Length == 0)
            {
                return BadRequest("Invalid file");
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "..\\Project-Documentation\\" + projectId);

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            ProjectDocumentation projectDocs = new ProjectDocumentation();

            projectDocs.ProjectId = projectId;
            projectDocs.Path = uploadsFolder;
            projectDocs.Title = documentFile.FileName;
            projectDocs.DateUploaded = DateTime.Now;


            repository.saveDocument(projectDocs);

            var path = Path.Combine(projectDocs.Path, projectDocs.Title);

            var stream = new FileStream(path, FileMode.Create);
            
            documentFile.CopyTo(stream);

            stream.Close();

            return Ok(new { fileUrl = path });
        }


        [HttpGet("project/{projectId}/documents")]
        public List<ProjectDocumentation> GetProjectDocuments(int projectId)
        {
            return repository.GetAll(projectId);
        }

        //TO DO DELETE


        [HttpGet("project/documents/{documentId}")]
        public ActionResult GetDocument(int documentId)
        {

            ProjectDocumentation projectDocs = repository.GetById(documentId);

            if(projectDocs == null)
            {
                return NotFound(new {message = "Document not found"});
            }

            var bytes = System.IO.File.ReadAllBytes(Path.Combine(projectDocs.Path,projectDocs.Title));

            return new FileStreamResult(new MemoryStream(bytes), "application/pdf");
        }

    }
}
