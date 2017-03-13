using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marten.Schema;

namespace LabLogApi.Model
{
    public class Post
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public Dates ModifiedDates { get; set; }

        public class Dates
        {
            public DateTime CreatedDate { get; set; }
            public DateTime LastEditedDate { get; set; }
        }

        [ForeignKey(typeof(User))]
        public Guid? AuthorId { get; set; }
    }
}
