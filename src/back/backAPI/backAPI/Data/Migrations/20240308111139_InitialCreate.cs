using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleCompanyId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleCompanyName = table.Column<string>(type: "TEXT", nullable: true),
                    WorkingHourPrice = table.Column<double>(type: "REAL", nullable: false),
                    OvertimeHourPrice = table.Column<double>(type: "REAL", nullable: false),
                    WeekendHourPrice = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleCompanyId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: true),
                    PasswordHash = table.Column<byte[]>(type: "BLOB", nullable: true),
                    PasswordSalt = table.Column<byte[]>(type: "BLOB", nullable: true),
                    UserEmail = table.Column<string>(type: "TEXT", nullable: true),
                    UserFirstName = table.Column<string>(type: "TEXT", nullable: true),
                    UserLastName = table.Column<string>(type: "TEXT", nullable: true),
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

            migrationBuilder.CreateIndex(
                name: "IX_Roles_RoleCompanyName",
                table: "Roles",
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
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
