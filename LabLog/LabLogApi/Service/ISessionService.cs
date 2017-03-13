using System.Threading.Tasks;

namespace LabLogApi.Service
{
    public interface ISessionService
    {
        Task<string> GetSessionFromGoogleCode(string code);
    }
}