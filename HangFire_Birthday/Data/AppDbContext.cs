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

            // Seed data:
            //   Employee 1 — birthday is May 3 (matches today) → triggers BirthdayMailJob
            //   Employee 2 — joining date is May 3, 2021 (matches today's month/day) → triggers WorkAnniversaryJob
            //   Employees 3–5 — future/random dates
            modelBuilder.Entity<Employee>().HasData(
                new Employee
                {
                    Id = 1,
                    Name = "Alice Johnson",
                    Email = "alice@example.com",
                    DateOfBirth = new DateTime(1990, 5, 3),    // Birthday today (May 3)
                    JoiningDate = new DateTime(2019, 3, 15),
                    Department = "Engineering",
                    IsActive = true
                },
                new Employee
                {
                    Id = 2,
                    Name = "Bob Smith",
                    Email = "bob@example.com",
                    DateOfBirth = new DateTime(1985, 6, 20),
                    JoiningDate = new DateTime(2021, 5, 3),    // Anniversary today (May 3) — 4 years!
                    Department = "Marketing",
                    IsActive = true
                },
                new Employee
                {
                    Id = 3,
                    Name = "Carol White",
                    Email = "carol@example.com",
                    DateOfBirth = new DateTime(1992, 8, 14),
                    JoiningDate = new DateTime(2022, 9, 1),
                    Department = "HR",
                    IsActive = true
                },
                new Employee
                {
                    Id = 4,
                    Name = "David Brown",
                    Email = "david@example.com",
                    DateOfBirth = new DateTime(1988, 11, 25),
                    JoiningDate = new DateTime(2020, 4, 10),
                    Department = "Finance",
                    IsActive = true
                },
                new Employee
                {
                    Id = 5,
                    Name = "Eva Martinez",
                    Email = "eva@example.com",
                    DateOfBirth = new DateTime(1995, 12, 5),
                    JoiningDate = new DateTime(2023, 7, 20),
                    Department = "Sales",
                    IsActive = false
                }
            );
        }
    }
}
