using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LabLogApi.Exceptions;
using LabLogApi.Model;
using Marten;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LabLogApi.Controllers
{
    [Route("api/posts")]
    public class PostController : Controller
    {
        private readonly IDocumentStore _documentStore;

        public PostController(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        [HttpGet]
        public IEnumerable<Post> Get()
        {
            using (var session = _documentStore.QuerySession())
            {
                return session.Query<Post>();
            }
        }
        
        [HttpGet("{id}")]
        public Post Get(Guid id)
        {
            using (var session = _documentStore.QuerySession())
            {
                return session
                    .Query<Post>()
                    .Where(post => post.Id == id)
                    .FirstOrDefault();
            }
        }
        
        [HttpPost]
        public Post Post([FromBody]Post post)
        {
            using (var session = _documentStore.LightweightSession())
            {
                post.ModifiedDates = new Model.Post.Dates() { CreatedDate = DateTime.UtcNow, LastEditedDate = DateTime.UtcNow };
                session.Store(post);
                session.SaveChanges();
                return post;
            }
        }
        
        [HttpPut("{id}")]
        public Post Put(Guid id, [FromBody]Post post)
        {
            using (var session = _documentStore.LightweightSession())
            {
                var existingPost = session.Query<Post>().Where(p => p.Id == id).Single();
                if (existingPost == null)
                    throw new NotFoundException();
                existingPost.Title = post.Title;
                existingPost.Body = post.Body;
                existingPost.ModifiedDates.LastEditedDate = DateTime.UtcNow;
                session.SaveChanges();
                return existingPost;
            }
        }
        
        [HttpDelete("{id}")]
        public void Delete(Guid id)
        {
            using (var session = _documentStore.LightweightSession())
            {
                session.Delete<Post>(id);
                session.SaveChanges();
            }
        }

    }
}