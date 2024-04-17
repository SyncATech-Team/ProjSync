namespace backAPI.DTO.Issues {
    public class IssueDependenciesUpdateDto {

        public int OriginId { get; set; }
        public int TargetId { get; set; }
        public bool IsDelete { get; set; }

    }
}
