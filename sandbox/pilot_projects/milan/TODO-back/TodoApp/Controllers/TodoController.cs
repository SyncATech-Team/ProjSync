using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Models;

namespace TodoApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly TodoDBContext _todoDBContext;
        public TodoController(TodoDBContext todoDBContext)
        {
            _todoDBContext = todoDBContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _todoDBContext.Tasks.ToListAsync();

            return Ok(tasks);
        }
        [HttpPost]
        public async Task<IActionResult> AddTask(TodoTask todoTask)
        {
            _todoDBContext.Tasks.Add(todoTask);
            await _todoDBContext.SaveChangesAsync();

            return Ok(todoTask);
        }
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateTask([FromRoute] int id, TodoTask task)
        {
            var taskToUpdate = await _todoDBContext.Tasks.FindAsync(id);
            if(taskToUpdate == null)
            {
                return NotFound();
            }
            taskToUpdate.Description=task.Description;
            taskToUpdate.DueDate=task.DueDate;

            await _todoDBContext.SaveChangesAsync();
            return Ok(taskToUpdate);
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteTask([FromRoute] int id)
        {
            var taskToDelete = await _todoDBContext.Tasks.FindAsync(id);
            if (taskToDelete == null)
            {
                return NotFound();
            }
            
            _todoDBContext.Tasks.Remove(taskToDelete);
            await _todoDBContext.SaveChangesAsync();

            return Ok(taskToDelete);
        }
    }
}
