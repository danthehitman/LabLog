using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marten.Schema;

namespace LabLogApi.Model
{
    public class Session
    {
        public int Id { get; set; }

        public string Token { get; set; }

        public DateTime Expires { get; set; }

        [ForeignKey(typeof(User))]
        public Guid? UserId { get; set; }
    }
}
