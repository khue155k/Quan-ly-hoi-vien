using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Notification
    {
        [Key]
        public uint id { get; set; }
        public uint admin_id { get; set; }
        public string? title { get; set; }
        public string message { get; set; }
        public string? img_url { get; set; }
        public DateTime send_at { get; set; }
        public DateTime update_at { get; set; }
        public byte status { get; set; }
    }
}
