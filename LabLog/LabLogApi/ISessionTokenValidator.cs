using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LabLogApi
{
    public interface ISessionTokenValidator
    {
        Task<bool> ValidateAsync(string apiKey);
    }
}
