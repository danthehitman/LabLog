using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using LabLogApi.Model;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;

namespace LabLogApi.Controllers
{
    [Produces("application/json")]
    [Route("api/images")]
    public class ImageController : Controller
    {
        private readonly IHostingEnvironment _appEnvironment;
        private readonly IDocumentStore _documentStore;

        public ImageController(IHostingEnvironment appEnvironment, IDocumentStore documentStore)
        {
            _documentStore = documentStore;
            _appEnvironment = appEnvironment;
        }

        // GET: api/Image
        [HttpGet]
        [Authorize(Policy = "AuthToken")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Image/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        
        // POST: api/Image
        [HttpPost]
        [Authorize(Policy = "AuthToken")]
        public async Task<List<string>> Post()
        {
            var newImageIds = new List<string>();
            long size = 0;
            var files = Request.Form.Files;
            foreach (var file in files)
            {
                Request.Form.TryGetValue("name", out StringValues name);
                var id = Guid.NewGuid();

                var filename = ContentDispositionHeaderValue
                                .Parse(file.ContentDisposition)
                                .FileName
                                .Trim('"');
                var fileExtension = filename.Substring(filename.LastIndexOf('.'));
                var newFileName = $"{id.ToString()}{fileExtension}";

                filename = Path.Combine(_appEnvironment.WebRootPath, Path.Combine("images", "userimages", newFileName));
                size += file.Length;
                using (FileStream fs = System.IO.File.Create(filename))
                {
                    await file.CopyToAsync(fs);
                    fs.Flush();
                }

                var newImage = new Image()
                {
                    Id = id,
                    Name = name,
                    FileName = newFileName
                };
                using (var session = _documentStore.LightweightSession())
                {
                    session.Store(newImage);
                    session.SaveChanges();
                }
                newImageIds.Add(id.ToString());
            }
            return newImageIds;
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AuthToken")]
        public void Delete(int id)
        {
        }
    }
}
