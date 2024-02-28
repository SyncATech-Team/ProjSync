using ToDo.Model;

namespace ToDo.Repository
{
    public class TodoItemRepository : ITodoItemRepository
    {
        private readonly DataContext context;

        public TodoItemRepository(DataContext context)
        {
            this.context = context;
        }

        public ICollection<TodoItem> GetItems()
        {
            return context.TodoItems.ToList();
        }

        public void Add(TodoItem item)
        {
            context.TodoItems.Add(item);
            context.SaveChanges();
        }

        public void Delete(int Id)
        {
            foreach(TodoItem item in context.TodoItems.ToList())
            {
                if(item.Id == Id)
                {
                    context.TodoItems.Remove(item);
                    context.SaveChanges();
                }
            }

        }
    }
}
