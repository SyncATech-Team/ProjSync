using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Tasks
{
    public interface ITasksRepository
    {

        /// <summary>
        /// Funkcija koja dohvata sve zadatke u odredjenoj grupi
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        Task<IEnumerable<Issue>> GetAllTasksForGivenGroup(int groupId);
        /// <summary>
        /// Funkcija za kreiranje novog zadatka
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        Task<Issue> CreateTaskAsync(Issue task);
    }
}
