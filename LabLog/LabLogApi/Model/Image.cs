using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Marten.Schema;

namespace LabLogApi.Model
{
    public class Image
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public IList<string> Tags { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime LastEditedDate { get; set; }

        [ForeignKey(typeof(User))]
        public Guid? OwnerId { get; set; }
    }
}
