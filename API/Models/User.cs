namespace API.Models
{
    public class User
    {
        public uint id { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string admin { get; set; }
        public uint company_id { get; set; }
        public string name { get; set; }
    }
}

