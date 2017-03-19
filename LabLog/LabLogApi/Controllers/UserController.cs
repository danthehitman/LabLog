using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LabLogApi.Model;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LabLogApi.Controllers
{
    [Produces("application/json")]
    [Route("api/users")]
    public class UserController : Controller
    {
        private readonly IDocumentStore _documentStore;

        public UserController(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        // GET: api/User
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/User/5
        [HttpGet("{id}", Name = "Get")]
        [Authorize(Policy = "AuthToken")]
        public string Get(int id)
        {
            return "value";
        }
        
        // POST: api/User
        [HttpPost]
        [Authorize(Policy = "AuthToken")]
        public User Post([FromBody]User user)
        {
            using (var session = _documentStore.LightweightSession())
            {
                session.Store(user);
                session.SaveChanges();
                return user;
            }
        }
        
        // PUT: api/User/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AuthToken")]
        public void Put(int id, [FromBody]string value)
        {
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AuthToken")]
        public void Delete(int id)
        {
        }
    }
}
