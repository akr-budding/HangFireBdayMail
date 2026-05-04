using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HangFire_Birthday.Migrations
{
    /// <inheritdoc />
    public partial class AddTestEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "DateOfBirth", "Department", "Email", "IsActive", "JoiningDate", "Name" },
                values: new object[] { 6, new DateTime(1993, 5, 4, 0, 0, 0, 0, DateTimeKind.Utc), "Engineering", "ashwini.kr.ranjan98@gmail.com", true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Test User" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 6);
        }
    }
}
