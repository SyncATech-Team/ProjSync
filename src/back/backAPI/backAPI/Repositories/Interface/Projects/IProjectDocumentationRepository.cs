using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Projects
{
    public interface IProjectDocumentationRepository
    {

        void saveDocument( ProjectDocumentation documentation);

        List<ProjectDocumentation> GetAll(long projectId);

        ProjectDocumentation GetById(long documentId);

    }
}
