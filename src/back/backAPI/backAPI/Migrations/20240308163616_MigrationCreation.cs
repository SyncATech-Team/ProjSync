using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backAPI.Migrations
{
    /// <inheritdoc />
    public partial class MigrationCreation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CompanyRoles",
                columns: table => new
                {
                    RoleCompanyId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleCompanyName = table.Column<string>(type: "TEXT", nullable: false),
                    WorkingHourPrice = table.Column<double>(type: "REAL", nullable: false),
                    OvertimeHourPrice = table.Column<double>(type: "REAL", nullable: false),
                    WeekendHourPrice = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyRoles", x => x.RoleCompanyId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "BLOB", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "BLOB", nullable: false),
                    UserEmail = table.Column<string>(type: "TEXT", nullable: false),
                    UserFirstName = table.Column<string>(type: "TEXT", nullable: false),
                    UserLastName = table.Column<string>(type: "TEXT", nullable: false),
                    RoleCompany = table.Column<int>(type: "INTEGER", nullable: false),
                    UserProfilePhoto = table.Column<string>(type: "TEXT", nullable: true),
                    UserAddress = table.Column<string>(type: "TEXT", nullable: true),
                    UserContactPhone = table.Column<string>(type: "TEXT", nullable: true),
                    UserLinkedinProfile = table.Column<string>(type: "TEXT", nullable: true),
                    UserStatus = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "WorkingHours",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SpecificDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    HoursWorking = table.Column<double>(type: "REAL", nullable: false),
                    Weekend = table.Column<bool>(type: "INTEGER", nullable: false),
                    Overtime = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkingHours", x => x.UserId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyRoles_RoleCompanyName",
                table: "CompanyRoles",
                column: "RoleCompanyName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserEmail",
                table: "Users",
                column: "UserEmail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyRoles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "WorkingHours");
        }
    }
}
