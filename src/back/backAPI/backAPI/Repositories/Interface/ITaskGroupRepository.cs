using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface {
    public interface ITaskGroupRepository {

        /// <summary>
        /// Funkcija koja za prosledjeni id projekta dohvata grupe taskova na tom projektu
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        Task<IEnumerable<TaskGroup>> GetGroupsAsync(int projectId);

        /// <summary>
        /// Funkcija koja kreira grupu na odredjenom projektu
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        Task<TaskGroup> CreateGroupAsync(TaskGroup group);

        /// <summary>
        /// Funkcija koja uklanja grupu sa projekta
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="groupId"></param>
        /// <returns></returns>
        Task<bool> DeleteGroupFromProjectAsync(int groupId);




        /// <summary>
        /// Metoda koja proverava da li postoji grupa sa istim imenom u okviru projekta
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        bool GroupNameExistsWithinTheSameProject(int projectId, string name);
    }
}
