using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LabLogApi.Model;
using Marten;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LabLogApi.Controllers
{
    [Route("/posts")]
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

        // GET api/values/5
        [HttpGet("{id}")]
        public Post Get(int id)
        {
            using (var session = _documentStore.QuerySession())
            {
                return session
                    .Query<Post>()
                    .Where(post => post.Id == id)
                    .FirstOrDefault();
            }
        }

        // POST api/values
        [HttpPost]
        public Post Post([FromBody]Post post)
        {
            using (var session = _documentStore.LightweightSession())
            {
                session.Store(post);
                session.SaveChanges();
                return post;
            }
        }
    }
}