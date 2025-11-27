using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntranetPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSicilRemoveEmailFromUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "idx_user_email",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "User");

            migrationBuilder.AddColumn<string>(
                name: "Sicil",
                table: "User",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "idx_user_sicil",
                table: "User",
                column: "Sicil",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "idx_user_sicil",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Sicil",
                table: "User");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "User",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "idx_user_email",
                table: "User",
                column: "Email",
                unique: true);
        }
    }
}
