using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Projects {
    public interface IProjectDocumentationRepository {

        bool ProjectDocumentationDirectoryExist();
        Task<string> WriteMultipleFilesAsync(int projectId, List<IFormFile> files);

    }
}
