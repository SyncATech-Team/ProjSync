using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Projects;

namespace backAPI.Repositories.Implementation.Projects
{
    public class ProjectDocumentationRepository : IProjectDocumentationRepository
    {
        private readonly DataContext _dataContext;
        public ProjectDocumentationRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public List<ProjectDocumentation> GetAll(long projectId)
        {

            return _dataContext.ProjectDocumentation.Where(predicate => predicate.ProjectId == projectId).ToList() ;
        
        }

        public ProjectDocumentation GetById(long documentId)
        {
            return _dataContext.ProjectDocumentation.Where(p => p.Id == documentId).FirstOrDefault();
        }

        public void saveDocument(ProjectDocumentation documentation)
        {
            _dataContext.ProjectDocumentation.Add(documentation);
            _dataContext.SaveChanges();
        }
    }
}
