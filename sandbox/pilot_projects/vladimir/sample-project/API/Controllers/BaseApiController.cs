using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    /// <summary>
    /// Bazni Api kontroler. Svi kontroleri koji naslede ovaj bazni imace putanju /api/<naziv kontrolera>
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    { }
}
