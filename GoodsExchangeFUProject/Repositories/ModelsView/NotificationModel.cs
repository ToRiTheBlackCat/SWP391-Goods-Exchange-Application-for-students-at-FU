using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.ModelsView
{
    public class NotificationReceivedView
    {
        public required int UserId { get; set; }

        public required int ProductId { get; set; }

        public required string ProductName { get; set; }

        public required int RequesterId { get; set; }

        public required string RequesterUserName { get; set; }
    }

    public class NotificationSendView
    {
        public required int UserId { get; set; }

        public required int ProductId { get; set; }

        public required int RequesterId { get; set; }
    }
}
