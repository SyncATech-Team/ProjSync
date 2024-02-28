using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CityInfo.API.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PointsOfInterest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    City = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Country = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PointsOfInterest", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "PointsOfInterest",
                columns: new[] { "Id", "City", "Country", "Description", "Name" },
                values: new object[] { 1, "Pariz", "Francuska", "Veliki toranj.", "Ajfelov toranj" });

            migrationBuilder.InsertData(
                table: "PointsOfInterest",
                columns: new[] { "Id", "City", "Country", "Description", "Name" },
                values: new object[] { 2, "Rim", "Italija", "Trg iz doba antickog Rima.", "Forum" });

            migrationBuilder.InsertData(
                table: "PointsOfInterest",
                columns: new[] { "Id", "City", "Country", "Description", "Name" },
                values: new object[] { 3, "Beograd", "Srbija", "Srednjevekovna tvrdjava.", "Kalemegdan" });

            migrationBuilder.InsertData(
                table: "PointsOfInterest",
                columns: new[] { "Id", "City", "Country", "Description", "Name" },
                values: new object[] { 4, "Kragujevac", "Srbija", "Muzej posvecen zrtvama drugog svetskog rata.", "Muzej 21. Oktobar" });

            migrationBuilder.InsertData(
                table: "PointsOfInterest",
                columns: new[] { "Id", "City", "Country", "Description", "Name" },
                values: new object[] { 5, "Milano", "Italija", "Jedna od najvecih katedrala evrope.", "Katedrala Duomo" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PointsOfInterest");
        }
    }
}
