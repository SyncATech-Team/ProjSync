using ToDo.Model;

namespace ToDo.Repository
{
    public interface ITodoItemRepository
    {

        ICollection<TodoItem> GetItems();
        void Add(TodoItem item);
        void Delete(int Id);

    }
}
