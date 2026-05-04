using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HangFire_Birthday.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    JoiningDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Department = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "DateOfBirth", "Department", "Email", "IsActive", "JoiningDate", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(1990, 5, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Engineering", "alice@example.com", true, new DateTime(2019, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Alice Johnson" },
                    { 2, new DateTime(1985, 6, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Marketing", "bob@example.com", true, new DateTime(2021, 5, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Bob Smith" },
                    { 3, new DateTime(1992, 8, 14, 0, 0, 0, 0, DateTimeKind.Utc), "HR", "carol@example.com", true, new DateTime(2022, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Carol White" },
                    { 4, new DateTime(1988, 11, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Finance", "david@example.com", true, new DateTime(2020, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), "David Brown" },
                    { 5, new DateTime(1995, 12, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Sales", "eva@example.com", false, new DateTime(2023, 7, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Eva Martinez" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
