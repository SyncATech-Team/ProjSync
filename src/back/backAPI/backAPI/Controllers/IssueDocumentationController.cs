using backAPI.Repositories.Implementation.Projects;
using backAPI.Repositories.Interface.Issues;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
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
                return BadRequest("There is no project with the given name");
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

    }
}
