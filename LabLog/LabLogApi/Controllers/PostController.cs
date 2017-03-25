using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LabLogApi.Exceptions;
using LabLogApi.Model;
using Marten;
using Marten.Linq;
using Microsoft.AspNetCore.Authorization;
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
        public IEnumerable<Post> Get([FromQuery] List<string> tags, [FromQuery] int? start, [FromQuery] int? count)
        {
            using (var session = _documentStore.QuerySession())
            {
                var query = session.Query<Post>();
                if (tags.Count() > 0)
                {
                    foreach (var tag in tags)
                    {
                        query = query.Where(x => x.Tags.Contains(tag)) as IMartenQueryable<Post>;
                    }
                }
                if (start.HasValue)
                    query = query.Skip(start.Value) as IMartenQueryable<Post>;
                if (count.HasValue)
                    query = query.Take(count.Value) as IMartenQueryable<Post>;
                query = query.OrderByDescending(p => p.PublishedDate)as IMartenQueryable<Post>;

                return query.ToArray();
            }
        }

        [HttpGet, Route("tags")]
        public IEnumerable<object> GetTags()
        {
            using (var session = _documentStore.QuerySession())
            {
                var tags = session.Query<Post>().SelectMany(x => x.Tags).ToList();
                return tags.GroupBy(x => x).Select(r => new { Count = r.Count(), Name = r.Key }).OrderByDescending(o => o.Count).ThenBy(t => t.Name);
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
        [Authorize(Policy = "AuthToken")]
        public Post Post([FromBody]Post post)
        {
            using (var session = _documentStore.LightweightSession())
            {
                post.CreatedDate = DateTime.UtcNow;
                post.LastEditedDate = DateTime.UtcNow;
                session.Store(post);
                session.SaveChanges();
                return post;
            }
        }
        
        [HttpPut("{id}")]
        [Authorize(Policy = "AuthToken")]
        public Post Put(Guid id, [FromBody]Post post)
        {
            using (var session = _documentStore.LightweightSession())
            {
                var existingPost = session.Query<Post>().Where(p => p.Id == id).Single();
                if (existingPost == null)
                    throw new NotFoundException();
                existingPost.Title = post.Title;
                existingPost.Body = post.Body;
                existingPost.LastEditedDate = DateTime.UtcNow;
                existingPost.Tags = existingPost.Tags.Select(s => s.Trim()).ToArray();
                session.Store(existingPost);
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