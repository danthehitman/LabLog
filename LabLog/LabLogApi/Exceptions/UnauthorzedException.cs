using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LabLogApi.Exceptions
{
    public class UnauthorzedException : Exception
    {
        public UnauthorzedException(string message) : base(message)
        {
        }
    }
}
