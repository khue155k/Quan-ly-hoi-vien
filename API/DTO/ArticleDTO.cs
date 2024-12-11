
public class ArticleDTO
{
    public uint id { get; set; }
    public string content { get; set; }
    public string? imageUrl { get; set; }
    public string accName { get; set; }
    public uint commentsCount { get; set; }
    public uint likesCount { get; set; }
    public uint retweetsCount { get; set; }
    public DateTime? send_at { get; set; }
}

