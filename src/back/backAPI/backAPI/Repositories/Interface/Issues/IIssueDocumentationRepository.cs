using backAPI.DTO.Documentation;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssueDocumentationRepository
    {
        bool IssueDocumentationDirectoryExist();
        Task<string> WriteMultipleFilesAsync(int issueId, List<IFormFile> files);
        Task<bool> DeleteDocument(int documentId);
        Task<IEnumerable<IssueDocumentation>> GetDocumentationForIssue(int issueId);
        IEnumerable<DocumentTitles> GetOlderVersionsSorted(ProjectDocumentation newest, IEnumerable<ProjectDocumentation> all);
        Task<ProjectDocumentation> GetDocumentById(int documentId);
    }
}
