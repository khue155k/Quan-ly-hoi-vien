using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Fee
    {
        [Key]
        public uint id { get; set; }
        public uint year { get; set; }
        public decimal fee_amount { get; set; }
    }

}

