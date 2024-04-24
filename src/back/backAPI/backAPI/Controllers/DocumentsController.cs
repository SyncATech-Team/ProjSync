using backAPI.DTO.Documentation;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    [Route("api/")]
    [ApiController]
    public class DocumentsController : ControllerBase {

        private readonly IProjectDocumentationRepository docsRepository;
        private readonly IProjectsRepository projectsRepository;


        public DocumentsController(
            IProjectDocumentationRepository docsRepository,
            IProjectsRepository projectsRepository) {

            this.docsRepository = docsRepository;
            this.projectsRepository = projectsRepository;

        }

        [HttpPost("project-documentation/{projectName}")]
        public async Task<ActionResult> UploadDocument(string projectName, List<IFormFile> files) {
            var project = await projectsRepository.GetProjectByName(projectName);
            if (project == null) {
                return BadRequest("There is no project with the given name");
            }

            Console.WriteLine("Postoji projekat");

            // proveri da li postoji direktorijum u koji zelimo da sacuvamo fajl
            // kreirati direktorijum za skladistenje dokumenata
            if (docsRepository.ProjectDocumentationDirectoryExist() == false) {
                Directory.CreateDirectory("../project-documentation");
            }

            var result = await docsRepository.WriteMultipleFilesAsync(project.Id, files);
            if (result != "OK") {
                return BadRequest($"Failed to upload documents: {result}");
            }

            Console.WriteLine("Upload??? : " + result);

            return Ok();
        }

        [HttpGet("project-documentation/get-titles/{projectName}")]
        public async Task<ActionResult<IEnumerable<DocumentTitles>>> GetDocumentTitles(string projectName) {

            var project = await projectsRepository.GetProjectByName(projectName);
            if (project == null) {
                return BadRequest("There is no project with the given name");
            }

            List<DocumentTitles> documentTitles = new List<DocumentTitles>();

            var papers = await docsRepository.GetDocumentationForProject(project.Id);

            // proveriti da li postoje dokumenti sa istim naslovom
            // ukoliko postoje proveriti datum dodavanja i vratiti najnoviji a ostale vratiti kao older versions

            foreach (var paper in papers) {
                var sameTitle = papers.Where<ProjectDocumentation>(p => p.Id != paper.Id && p.Title == paper.Title);
                if (sameTitle.Any() == false) {
                    // ne postoji drugi dokument sa istim imenom
                    documentTitles.Add(new DocumentTitles { 
                        DocumentId = paper.Id,
                        Title = paper.Title,
                        DateUploaded = paper.DateUploaded,
                        OlderVersions = []
                    });

                    continue;
                }


                // postoji bar jedan dokument koji ima isti naziv kao i trenutni
                // proveriti da li postoji noviji
                // ukoliko je trenutni najnoviji onda trenutni proglasiti kao najnoviji

                var existsNewerDocument = sameTitle.Where(o => o.DateUploaded > paper.DateUploaded);
                if(existsNewerDocument.Any()) {
                    continue; // ovaj dokument ce biti dodat kada se bude dodavao noviji
                }

                // trenutni dokument je najnoviji i sve ostale treba dodati u njegovu listu OlderVersion
                IEnumerable<DocumentTitles> olderVersions = [];
                foreach(var older in sameTitle) {
                    olderVersions = olderVersions.Append(new DocumentTitles {
                        DocumentId = older.Id,
                        Title = older.Title,
                        DateUploaded = older.DateUploaded,
                        OlderVersions = []
                    });
                }

                var d = new DocumentTitles {
                    DocumentId = paper.Id,
                    Title = paper.Title,
                    DateUploaded = paper.DateUploaded,
                    OlderVersions = olderVersions.OrderByDescending(p => p.DateUploaded).ToArray<DocumentTitles>()
                };


                documentTitles.Add(d);
            }

            return documentTitles;
        }

    }
}
