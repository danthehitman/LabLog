using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using LabLogApi.Controllers.Dto;
using LabLogApi.Exceptions;
using LabLogApi.Model;
using LabLogApi.Service;
using Marten;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LabLogApi.Controllers
{
    [Produces("application/json")]
    [Route("api/sessions")]
    public class SessionController : Controller
    {
        private readonly IDocumentStore _documentStore;
        private readonly ISessionService _sessionService;

        public SessionController(IDocumentStore documentStore, ISessionService sessionService)
        {
            _documentStore = documentStore;
            _sessionService = sessionService;
        }

        // GET: api/session/<token>
        [HttpGet("{token}", Name = "GetSessionToken")]
        public SessionDto Get(string token)
        {
            SessionDto result = null;
            using (var session = _documentStore.LightweightSession())
            {
                var userSession = session.Query<Session>().Where(s => s.Token == token && s.Expires >= DateTime.UtcNow).FirstOrDefault();
                if (userSession != null)
                    result = new SessionDto() { Token = userSession.Token};
            }
            if (result == null)
                throw new NotFoundException();
            return result;
        }

        // POST: api/session/google
        [HttpPost, Route("google")]
        public async Task<SessionDto> Post([FromBody]PostGoogleCode body)
        {
            var token = await _sessionService.GetSessionFromGoogleCode(body.Code);
            if (token == null)
                throw new UnauthorzedException("Unauthorized");
            else
                return new SessionDto() { Token = token };
        }

        // POST: api/session
        [HttpPost]
        public string Post([FromBody]PostCredentials body)
        {
            return null;
        }
    }
}
