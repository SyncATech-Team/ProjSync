using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backAPI.Migrations
{
    /// <inheritdoc />
    public partial class MigrationUsersAddedTheme : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PreferedTheme",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PreferedTheme",
                table: "AspNetUsers");
        }
    }
}
