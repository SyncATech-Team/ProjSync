using backAPI.DTO.Documentation;
using backAPI.Entities.Domain;
using backAPI.Repositories.Implementation.Issues;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    [Authorize]
    public class IssueDocumentationController : BaseApiController
    {
        private readonly IIssueDocumentationRepository docsRepository;
        private readonly IIssueRepository _issueRepository;

        public IssueDocumentationController(IIssueDocumentationRepository docsRepository, IIssueRepository issueRepository)
        {
            this.docsRepository = docsRepository;
            _issueRepository = issueRepository;
        }

        [HttpPost("issue-documentation/{issueId}")]

        public async Task<ActionResult> UploadDocument(int issueId, List<IFormFile> files)
        {
            var issue = await _issueRepository.GetIssueById(issueId);
            if (issue == null)
            {
                return BadRequest("There is no issue with the given id");
            }

            Console.WriteLine("Postoji projekat");

            // proveri da li postoji direktorijum u koji zelimo da sacuvamo fajl
            // kreirati direktorijum za skladistenje dokumenata
            if (docsRepository.IssueDocumentationDirectoryExist() == false)
            {
                Directory.CreateDirectory("../issue-documentation");
            }

            var result = await docsRepository.WriteMultipleFilesAsync(issue.Id, files);
            if (result != "OK")
            {
                return BadRequest($"Failed to upload documents: {result}");
            }

            Console.WriteLine("Upload??? : " + result);

            return Ok();
        }

        [HttpGet("issue-documentation/get-titles/{issueId}")]
        public async Task<ActionResult<IEnumerable<DocumentTitles>>> GetDocumentTitles(int issueId)
        {

            var issue = await _issueRepository.GetIssueById(issueId);
            if (issue == null)
            {
                return BadRequest("There is no issue with the given id");
            }

            List<DocumentTitles> documentTitles = new List<DocumentTitles>();

            List<IssueDocumentation> papers = (await docsRepository.GetDocumentationForIssue(issue.Id)).ToList(); //proveriti

            // proveriti da li postoje dokumenti sa istim naslovom
            // ukoliko postoje proveriti datum dodavanja i vratiti najnoviji a ostale vratiti kao older versions

            foreach (var paper in papers)
            {
                var sameTitle = papers.Where(p => p.Id != paper.Id && p.Title == paper.Title); //proveriti

                if (sameTitle.Any() == false)
                {
                    // ne postoji drugi dokument sa istim imenom
                    documentTitles.Add(new DocumentTitles
                    {
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
                if (existsNewerDocument.Any())
                {
                    continue; // ovaj dokument ce biti dodat kada se bude dodavao noviji
                }

                // trenutni dokument je najnoviji i sve ostale treba dodati u njegovu listu OlderVersion
                IEnumerable<DocumentTitles> olderVersions = [];
                foreach (var older in sameTitle)
                {
                    olderVersions = olderVersions.Append(new DocumentTitles
                    {
                        DocumentId = older.Id,
                        Title = older.Title,
                        DateUploaded = older.DateUploaded,
                        OlderVersions = []
                    });
                }

                var d = new DocumentTitles
                {
                    DocumentId = paper.Id,
                    Title = paper.Title,
                    DateUploaded = paper.DateUploaded,
                    OlderVersions = olderVersions.OrderByDescending(p => p.DateUploaded).ToArray<DocumentTitles>()
                };


                documentTitles.Add(d);
            }

            return documentTitles;
        }

        [HttpDelete("issue-documentation")]
        public async Task<ActionResult> DeleteRecord(int id)
        {
            var deleted = await docsRepository.DeleteDocument(id);
            
            if (deleted == false) {
                return BadRequest("Unable to delete record");
            }
            
            return Ok(deleted);
        }

        [HttpGet("issue-documentation/{id}/download")]
        public async Task<IActionResult> GetDocumentContent(int id)
        {
            Console.WriteLine("TEST");
            var document = await docsRepository.GetDocumentById(id);
            if (document == null)
            {
                return NotFound();
            }
            Console.WriteLine("TEST1 " + document.Title);

            var filePath = document.Path;
            Console.WriteLine("TEST2 " + filePath);

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, "application/octet-stream", document.Title);
        }
    }
}
