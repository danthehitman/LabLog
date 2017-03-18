using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace LabLogApi.Auth
{
    public class AuthTokenRequirement : IAuthorizationRequirement
    {
        public AuthTokenRequirement()
        {
        }
    }
}
