using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backAPI.Migrations
{
    /// <inheritdoc />
    public partial class UsersOnIssuesCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersOnIssues_Issues_IssueId",
                table: "UsersOnIssues");

            migrationBuilder.AddForeignKey(
                name: "FK_UsersOnIssues_Issues_IssueId",
                table: "UsersOnIssues",
                column: "IssueId",
                principalTable: "Issues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersOnIssues_Issues_IssueId",
                table: "UsersOnIssues");

            migrationBuilder.AddForeignKey(
                name: "FK_UsersOnIssues_Issues_IssueId",
                table: "UsersOnIssues",
                column: "IssueId",
                principalTable: "Issues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
