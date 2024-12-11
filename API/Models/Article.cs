namespace API.Models
{
    public class Article
    {
        public uint id { get; set; }
        public string content { get; set; }
        public string? imageUrl { get; set; }
        public uint company_id { get; set; }
        public uint commentsCount { get; set; }
        public uint likesCount { get; set; }
        public uint retweetsCount { get; set; }
        public DateTime send_at { get; set; }    
    }
}
