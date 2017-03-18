using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LabLogApi.Model;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Primitives;

namespace LabLogApi.Auth
{
    public class AuthTokenHandler : AuthorizationHandler<AuthTokenRequirement>
    {
        private readonly IDocumentStore _documentStore;

        public AuthTokenHandler(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AuthTokenRequirement requirement)
        {
            var mvcContext = context.Resource as Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext;
            if (mvcContext != null && mvcContext.HttpContext.Request.Headers.Keys.Contains("Authorization"))
            {
                mvcContext.HttpContext.Request.Headers.TryGetValue("Authorization", out StringValues Token);
                if (Token.Count > 0)
                {
                    var authToken = Token[0];
                    using (var session = _documentStore.LightweightSession())
                    {
                        if (session.Query<Session>().Where(s => s.Token == authToken && s.Expires >= DateTime.UtcNow).Any())
                        {
                            context.Succeed(requirement);
                        }
                    }
                }
            }
            return Task.CompletedTask;
        }
    }
}
