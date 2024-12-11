using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Company> Companies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Fee> Fees { get; set; }
        public DbSet<MembershipFee> MembershipFees { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        public DbSet<Article> Articles { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MembershipFee>()
                .HasOne(m => m.Company)
                .WithMany()
                .HasForeignKey(m => m.company_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MembershipFee>()
                .HasOne(m => m.Fee)
                .WithMany()
                .HasForeignKey(m => m.fee_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Company>().HasKey(c => c.id);
        }
    }
}