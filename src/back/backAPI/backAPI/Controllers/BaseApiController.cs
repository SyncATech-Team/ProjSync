using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        public static string BaseFrontendUrl = "http://softeng.pmf.kg.ac.rs:10204/";
    }
}
