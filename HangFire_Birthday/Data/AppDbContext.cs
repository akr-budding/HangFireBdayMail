using HangFire_Birthday.Models;
using Microsoft.EntityFrameworkCore;

namespace HangFire_Birthday.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // All DateTime values use DateTimeKind.Utc — required by Npgsql v6+
            modelBuilder.Entity<Employee>().HasData(
                new Employee
                {
                    Id = 1,
                    Name = "Alice Johnson",
                    Email = "alice@example.com",
                    DateOfBirth = new DateTime(1990, 5, 3, 0, 0, 0, DateTimeKind.Utc),
                    JoiningDate = new DateTime(2019, 3, 15, 0, 0, 0, DateTimeKind.Utc),
                    Department = "Engineering",
                    IsActive = true
                },
                new Employee
                {
                    Id = 2,
                    Name = "Bob Smith",
                    Email = "bob@example.com",
                    DateOfBirth = new DateTime(1985, 6, 20, 0, 0, 0, DateTimeKind.Utc),
                    JoiningDate = new DateTime(2021, 5, 3, 0, 0, 0, DateTimeKind.Utc),
                    Department = "Marketing",
                    IsActive = true
                },
                new Employee
                {
                    Id = 3,
                    Name = "Carol White",
                    Email = "carol@example.com",
                    DateOfBirth = new DateTime(1992, 8, 14, 0, 0, 0, DateTimeKind.Utc),
                    JoiningDate = new DateTime(2022, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                    Department = "HR",
                    IsActive = true
                },
                new Employee
                {
                    Id = 4,
                    Name = "David Brown",
                    Email = "david@example.com",
                    DateOfBirth = new DateTime(1988, 11, 25, 0, 0, 0, DateTimeKind.Utc),
                    JoiningDate = new DateTime(2020, 4, 10, 0, 0, 0, DateTimeKind.Utc),
                    Department = "Finance",
                    IsActive = true
                },
                new Employee
                {
                    Id = 5,
                    Name = "Eva Martinez",
                    Email = "eva@example.com",
                    DateOfBirth = new DateTime(1995, 12, 5, 0, 0, 0, DateTimeKind.Utc),
                    JoiningDate = new DateTime(2023, 7, 20, 0, 0, 0, DateTimeKind.Utc),
                    Department = "Sales",
                    IsActive = false
                },
                // Test employee — birthday today (May 4) so birthday job can be verified
                new Employee
                {
                    Id = 6,
                    Name = "Test User",
                    Email = "ashwini.kr.ranjan98@gmail.com",
                    DateOfBirth = new DateTime(1993, 5, 4, 0, 0, 0, DateTimeKind.Utc),
                    JoiningDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    Department = "Engineering",
                    IsActive = true
                }
            );
        }
    }
}
