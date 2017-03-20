using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using LabLogApi.Exceptions;
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
        public IEnumerable<Image> Get()
        {
            using (var session = _documentStore.LightweightSession())
            {
                return session.Query<Image>();
            }
        }

        // GET: api/Image/5
        [HttpGet("{id}")]
        [Authorize(Policy = "AuthToken")]
        public Image Get(Guid id)
        {
            using (var session = _documentStore.LightweightSession())
            {
                var image = session.Query<Image>().Where(i => i.Id == id).FirstOrDefault();
                if (image != null)
                    return image;
                else
                    throw new NotFoundException();
            }
        }

        // GET: api/Image/5
        [HttpGet("{id}/file")]
        public FileStreamResult GetFile(Guid id)
        {
            using (var session = _documentStore.LightweightSession())
            {
                var image = session.Query<Image>().Where(i => i.Id == id).FirstOrDefault();
                if (image != null)
                {
                    var filePath = Path.Combine(_appEnvironment.WebRootPath
                        , Path.Combine("images", "userimages", image.FileName));

                    FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                    return File(fs, "image/png");
                }
                else
                    throw new NotFoundException();
            }
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
                Request.Form.TryGetValue("tags", out StringValues tags);
                Request.Form.TryGetValue("description", out StringValues description);
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
                    FileName = newFileName,
                    Description = description,
                    Tags = tags[0].Split(',').ToArray(),
                    CreatedDate = DateTime.UtcNow,
                    LastEditedDate = DateTime.UtcNow
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
        public void Delete(Guid id)
        {
            using (var session = _documentStore.LightweightSession())
            {
                var image = session.Query<Image>().Where(i => i.Id == id).FirstOrDefault();
                if (image != null)
                {
                    session.Delete(image);
                    session.SaveChanges();
                }
                else
                    throw new NotFoundException();
            }
        }
    }
}
