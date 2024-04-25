namespace backAPI.Other.Helpers
{
    public class Criteria
    {
        public int First { get; set; }
        public int Rows { get; set; }
        public List<Filter> Filters { get; set; }
        public List<MultiSortMeta> MultiSortMeta { get; set; }
    }
}
