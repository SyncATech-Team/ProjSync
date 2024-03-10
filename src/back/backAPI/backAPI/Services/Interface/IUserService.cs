namespace backAPI.Services.Interface {
    public interface IUserService {
        public int UsernameToId(string username);
        public int EmailToId(string email);
    }
}
