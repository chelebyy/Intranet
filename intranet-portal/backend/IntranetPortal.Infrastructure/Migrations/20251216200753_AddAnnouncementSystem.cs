using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IntranetPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAnnouncementSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Announcements",
                columns: table => new
                {
                    AnnouncementID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DisplayType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Announcements", x => x.AnnouncementID);
                    table.ForeignKey(
                        name: "FK_Announcements_User_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnnouncementTargets",
                columns: table => new
                {
                    TargetID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AnnouncementID = table.Column<int>(type: "integer", nullable: false),
                    TargetType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TargetValue = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnnouncementTargets", x => x.TargetID);
                    table.ForeignKey(
                        name: "FK_AnnouncementTargets_Announcements_AnnouncementID",
                        column: x => x.AnnouncementID,
                        principalTable: "Announcements",
                        principalColumn: "AnnouncementID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserAcknowledgments",
                columns: table => new
                {
                    AcknowledgmentID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AnnouncementID = table.Column<int>(type: "integer", nullable: false),
                    UserID = table.Column<int>(type: "integer", nullable: false),
                    AcknowledgedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    IPAddress = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAcknowledgments", x => x.AcknowledgmentID);
                    table.ForeignKey(
                        name: "FK_UserAcknowledgments_Announcements_AnnouncementID",
                        column: x => x.AnnouncementID,
                        principalTable: "Announcements",
                        principalColumn: "AnnouncementID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserAcknowledgments_User_UserID",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Announcements_CreatedByUserId",
                table: "Announcements",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AnnouncementTargets_AnnouncementID",
                table: "AnnouncementTargets",
                column: "AnnouncementID");

            migrationBuilder.CreateIndex(
                name: "IX_UserAcknowledgments_AnnouncementID",
                table: "UserAcknowledgments",
                column: "AnnouncementID");

            migrationBuilder.CreateIndex(
                name: "IX_UserAcknowledgments_UserID",
                table: "UserAcknowledgments",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnnouncementTargets");

            migrationBuilder.DropTable(
                name: "UserAcknowledgments");

            migrationBuilder.DropTable(
                name: "Announcements");
        }
    }
}
