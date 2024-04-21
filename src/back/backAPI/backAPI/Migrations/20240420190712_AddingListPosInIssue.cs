using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddingListPosInIssue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ListPosition",
                table: "Issues",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ListPosition",
                table: "Issues");
        }
    }
}
