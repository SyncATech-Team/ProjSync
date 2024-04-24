using backAPI.DTO.Documentation;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Projects {
    public interface IProjectDocumentationRepository {

        bool ProjectDocumentationDirectoryExist();
        Task<string> WriteMultipleFilesAsync(int projectId, List<IFormFile> files);
        Task<IEnumerable<ProjectDocumentation>> GetDocumentationForProject(int projectId);

        IEnumerable<DocumentTitles> GetOlderVersionsSorted(ProjectDocumentation newest, IEnumerable<ProjectDocumentation> all);
    }
}
