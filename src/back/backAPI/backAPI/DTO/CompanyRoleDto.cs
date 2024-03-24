namespace backAPI.DTO
{
    public class CompanyRoleDto
    {
        public string Name { get; set; }
        public bool CanManageProjects { get; set; } = false;
        public bool CanManageTasks { get; set; } = false;
        public bool CanUpdateTaskProgress { get; set; } = false;
        public bool CanLeaveComments { get; set; } = false;
        public bool CanUploadFiles { get; set; } = false;
    }
}
