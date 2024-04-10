using backAPI.DTO.Issues;
using backAPI.Entities.Domain;

namespace backAPI.Repositories.Interface.Issues
{
    public interface IIssueGroupRepository
    {
        /// <summary>
        /// Funkcija koja za prosledjeni id projekta dohvata grupe taskova na tom projektu
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        Task<IEnumerable<IssueGroup>> GetGroupsAsync(int projectId);

        /// <summary>
        /// Funkcija koja za prosledjeni id dohvati TaskGroup
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        Task<IssueGroup> GetGroupAsync(int id);

        /// <summary>
        /// Funkcija koja vraca TaskGroup po imenu koji se nalazi u nekom projektu
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        Task<IssueGroup> GetGroupByNameAsync(int projectId, string name);

        /// <summary>
        /// Funkcija koja kreira grupu na odredjenom projektu
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        Task<IssueGroup> CreateGroupAsync(IssueGroup group);

        /// <summary>
        /// Funkcija koja uklanja grupu sa projekta
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="groupId"></param>
        /// <returns></returns>
        Task<bool> DeleteGroupFromProjectAsync(int groupId);

        /// <summary>
        /// Funkcija koja pronalazi grupu za date id-jeve projekta i grupe
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="groupId"></param>
        /// <returns></returns>
        Task<IssueGroupResponseDto> GetGroupForNameInProject(int projectId, int groupId);


        /// <summary>
        /// Metoda koja proverava da li postoji grupa sa istim imenom u okviru projekta
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        Task<bool> GroupNameExistsWithinTheSameProject(int projectId, string name);
    }
}
