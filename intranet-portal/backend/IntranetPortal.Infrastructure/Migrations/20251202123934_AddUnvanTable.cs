using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IntranetPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUnvanTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UnvanID",
                table: "User",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Unvan",
                columns: table => new
                {
                    UnvanID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UnvanAdi = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Aciklama = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Unvan", x => x.UnvanID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_UnvanID",
                table: "User",
                column: "UnvanID");

            migrationBuilder.CreateIndex(
                name: "idx_unvan_active",
                table: "Unvan",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "idx_unvan_adi_unique",
                table: "Unvan",
                column: "UnvanAdi",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_User_Unvan_UnvanID",
                table: "User",
                column: "UnvanID",
                principalTable: "Unvan",
                principalColumn: "UnvanID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Unvan_UnvanID",
                table: "User");

            migrationBuilder.DropTable(
                name: "Unvan");

            migrationBuilder.DropIndex(
                name: "IX_User_UnvanID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "UnvanID",
                table: "User");
        }
    }
}
