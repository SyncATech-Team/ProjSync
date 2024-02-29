using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using ToDo.Repository;
using ToDo.Model;

namespace ToDo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoAppController : ControllerBase
    {

        private readonly ITodoItemRepository Repository;

        public ToDoAppController(ITodoItemRepository repository)
        {
            Repository = repository;
        }

        [HttpGet]
        public IActionResult getItems()
        {
            return Ok(Repository.GetItems());
        }
        [HttpPost]
        public void AddItem(TodoItem item)
        {
            Repository.Add(item);
        }

        [HttpDelete("{Id}")]
        public void DeleteItem(int Id)
        {
            Repository.Delete(Id);
        }
    }
}
