using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IntranetPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Birim",
                columns: table => new
                {
                    BirimID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BirimAdi = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Aciklama = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Birim", x => x.BirimID);
                });

            migrationBuilder.CreateTable(
                name: "Permission",
                columns: table => new
                {
                    PermissionID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Resource = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permission", x => x.PermissionID);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleAdi = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Aciklama = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AdSoyad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    SifreHash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Unvan = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SonGiris = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "RolePermission",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleID = table.Column<int>(type: "integer", nullable: false),
                    PermissionID = table.Column<int>(type: "integer", nullable: false),
                    GrantedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    PermissionID1 = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermission", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RolePermission_Permission_PermissionID1",
                        column: x => x.PermissionID1,
                        principalTable: "Permission",
                        principalColumn: "PermissionID");
                    table.ForeignKey(
                        name: "fk_roleperm_permission",
                        column: x => x.PermissionID,
                        principalTable: "Permission",
                        principalColumn: "PermissionID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_roleperm_role",
                        column: x => x.RoleID,
                        principalTable: "Role",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AuditLog",
                columns: table => new
                {
                    LogID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserID = table.Column<int>(type: "integer", nullable: true),
                    BirimID = table.Column<int>(type: "integer", nullable: true),
                    Action = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Resource = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Details = table.Column<string>(type: "jsonb", nullable: true),
                    IPAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    TarihSaat = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    BirimID1 = table.Column<int>(type: "integer", nullable: true),
                    UserID1 = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLog", x => x.LogID);
                    table.ForeignKey(
                        name: "FK_AuditLog_Birim_BirimID1",
                        column: x => x.BirimID1,
                        principalTable: "Birim",
                        principalColumn: "BirimID");
                    table.ForeignKey(
                        name: "FK_AuditLog_User_UserID1",
                        column: x => x.UserID1,
                        principalTable: "User",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "fk_auditlog_birim",
                        column: x => x.BirimID,
                        principalTable: "Birim",
                        principalColumn: "BirimID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_auditlog_user",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    SettingID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SettingKey = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SettingValue = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedByUserID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.SettingID);
                    table.ForeignKey(
                        name: "FK_SystemSettings_User_UpdatedByUserID",
                        column: x => x.UpdatedByUserID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "UploadedFile",
                columns: table => new
                {
                    FileID = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    OriginalFileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    MimeType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FileExtension = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    FileHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    EntityType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    EntityID = table.Column<int>(type: "integer", nullable: false),
                    UploadedByUserID = table.Column<int>(type: "integer", nullable: false),
                    BirimID = table.Column<int>(type: "integer", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    UserID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UploadedFile", x => x.FileID);
                    table.ForeignKey(
                        name: "FK_UploadedFile_Birim_BirimID",
                        column: x => x.BirimID,
                        principalTable: "Birim",
                        principalColumn: "BirimID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UploadedFile_User_UserID",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "fk_uploadedfile_user",
                        column: x => x.UploadedByUserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserBirimRole",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserID = table.Column<int>(type: "integer", nullable: false),
                    BirimID = table.Column<int>(type: "integer", nullable: false),
                    RoleID = table.Column<int>(type: "integer", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    RoleID1 = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBirimRole", x => x.ID);
                    table.ForeignKey(
                        name: "FK_UserBirimRole_Role_RoleID1",
                        column: x => x.RoleID1,
                        principalTable: "Role",
                        principalColumn: "RoleID");
                    table.ForeignKey(
                        name: "fk_userbr_birim",
                        column: x => x.BirimID,
                        principalTable: "Birim",
                        principalColumn: "BirimID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_userbr_role",
                        column: x => x.RoleID,
                        principalTable: "Role",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_userbr_user",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_BirimID1",
                table: "AuditLog",
                column: "BirimID1");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_UserID1",
                table: "AuditLog",
                column: "UserID1");

            migrationBuilder.CreateIndex(
                name: "idx_auditlog_action",
                table: "AuditLog",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "idx_auditlog_birim",
                table: "AuditLog",
                column: "BirimID");

            migrationBuilder.CreateIndex(
                name: "idx_auditlog_tarih",
                table: "AuditLog",
                column: "TarihSaat");

            migrationBuilder.CreateIndex(
                name: "idx_auditlog_user",
                table: "AuditLog",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "idx_auditlog_user_tarih",
                table: "AuditLog",
                columns: new[] { "UserID", "TarihSaat" });

            migrationBuilder.CreateIndex(
                name: "idx_birim_active",
                table: "Birim",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "idx_permission_action_resource",
                table: "Permission",
                columns: new[] { "Action", "Resource" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_role_adi",
                table: "Role",
                column: "RoleAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RolePermission_PermissionID1",
                table: "RolePermission",
                column: "PermissionID1");

            migrationBuilder.CreateIndex(
                name: "idx_roleperm_permission",
                table: "RolePermission",
                column: "PermissionID");

            migrationBuilder.CreateIndex(
                name: "idx_roleperm_role",
                table: "RolePermission",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "idx_roleperm_role_permission",
                table: "RolePermission",
                columns: new[] { "RoleID", "PermissionID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SystemSettings_UpdatedByUserID",
                table: "SystemSettings",
                column: "UpdatedByUserID");

            migrationBuilder.CreateIndex(
                name: "idx_systemsettings_key",
                table: "SystemSettings",
                column: "SettingKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UploadedFile_BirimID",
                table: "UploadedFile",
                column: "BirimID");

            migrationBuilder.CreateIndex(
                name: "IX_UploadedFile_UserID",
                table: "UploadedFile",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "idx_uploadedfile_date",
                table: "UploadedFile",
                column: "UploadedAt");

            migrationBuilder.CreateIndex(
                name: "idx_uploadedfile_entity",
                table: "UploadedFile",
                columns: new[] { "EntityType", "EntityID" });

            migrationBuilder.CreateIndex(
                name: "idx_uploadedfile_user",
                table: "UploadedFile",
                column: "UploadedByUserID");

            migrationBuilder.CreateIndex(
                name: "idx_user_active",
                table: "User",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "idx_user_email",
                table: "User",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserBirimRole_RoleID1",
                table: "UserBirimRole",
                column: "RoleID1");

            migrationBuilder.CreateIndex(
                name: "idx_userbr_birim",
                table: "UserBirimRole",
                column: "BirimID");

            migrationBuilder.CreateIndex(
                name: "idx_userbr_role",
                table: "UserBirimRole",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "idx_userbr_user",
                table: "UserBirimRole",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "idx_userbr_user_birim",
                table: "UserBirimRole",
                columns: new[] { "UserID", "BirimID" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLog");

            migrationBuilder.DropTable(
                name: "RolePermission");

            migrationBuilder.DropTable(
                name: "SystemSettings");

            migrationBuilder.DropTable(
                name: "UploadedFile");

            migrationBuilder.DropTable(
                name: "UserBirimRole");

            migrationBuilder.DropTable(
                name: "Permission");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "Birim");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
