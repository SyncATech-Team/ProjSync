using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backAPI.Migrations
{
    /// <inheritdoc />
    public partial class MigrationLogsFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "Logs",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Logs_ProjectId",
                table: "Logs",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Logs_Projects_ProjectId",
                table: "Logs",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Logs_Projects_ProjectId",
                table: "Logs");

            migrationBuilder.DropIndex(
                name: "IX_Logs_ProjectId",
                table: "Logs");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Logs");
        }
    }
}
