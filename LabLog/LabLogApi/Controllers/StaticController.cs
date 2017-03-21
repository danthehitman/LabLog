using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace LabLogApi.Controllers
{
    [Produces("application/json")]
    public class StaticController : Controller
    {
        private readonly IHostingEnvironment _appEnvironment;

        public StaticController(IHostingEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }
        
        [Route("index")]
        public ActionResult GetIndex()
        {
            var filePath = Path.Combine(_appEnvironment.WebRootPath
                        , Path.Combine("index.html"));

            FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fs, "text/html");
        }

        [Route("post/{id}")]
        public ActionResult GetPost()
        {
            var filePath = Path.Combine(_appEnvironment.WebRootPath
                        , Path.Combine("index.html"));

            FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fs, "text/html");
        }

        [Route("admin")]
        public ActionResult GetAdmin()
        {
            var filePath = Path.Combine(_appEnvironment.WebRootPath
                        , Path.Combine("admin.html"));

            FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fs, "text/html");
        }
    }
}