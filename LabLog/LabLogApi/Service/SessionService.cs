using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Oauth2.v2;
using Google.Apis.Oauth2.v2.Data;
using Google.Apis.Plus.v1;
using LabLogApi.Model;
using Marten;

namespace LabLogApi.Service
{
    public class SessionService : ISessionService
    {
        private readonly IDocumentStore _documentStore;

        public static ClientSecrets secrets = null;

        // Uncomment to retrieve email.
        static public string[] SCOPES = { PlusService.Scope.PlusLogin, PlusService.Scope.UserinfoEmail };


        public SessionService(string clientId, string clientSecret, IDocumentStore documentStore)
        {
            _documentStore = documentStore;

            secrets = new ClientSecrets()
            {
                ClientId = clientId,
                ClientSecret = clientSecret
            };
        }
        public async Task<string> GetSessionFromGoogleCode(string code)
        {
            string sessionToken = null;

            TokenResponse token;
            IAuthorizationCodeFlow flow =
                        new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                        {
                            ClientSecrets = secrets,
                            Scopes = SCOPES
                        });

            token = flow.ExchangeCodeForTokenAsync("",code, "postmessage",
                            CancellationToken.None).Result;

            Oauth2Service service = new Oauth2Service(
                       new Google.Apis.Services.BaseClientService.Initializer());
            Oauth2Service.TokeninfoRequest request = service.Tokeninfo();
            request.AccessToken = token.AccessToken;

            Tokeninfo info = request.Execute();

            string gplus_id = info.UserId;

            using (var session = _documentStore.LightweightSession())
            {
                var user = await session.Query<User>().Where(u=>u.Email == info.Email).FirstOrDefaultAsync();
                if (user != null)
                {
                    var userSession = new Session()
                    {
                        Token = Guid.NewGuid().ToString(),
                        Expires = DateTime.UtcNow.AddHours(2),
                        UserId = user.Id
                    };
                    session.Store(userSession);
                    await session.SaveChangesAsync();

                    sessionToken = userSession.Token;
                }
            }

            return sessionToken;
        }
    }
}
