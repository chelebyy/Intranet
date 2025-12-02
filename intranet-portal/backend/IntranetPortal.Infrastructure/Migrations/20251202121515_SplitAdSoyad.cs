using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntranetPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SplitAdSoyad : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Add new columns with nullable
            migrationBuilder.AddColumn<string>(
                name: "Ad",
                table: "User",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Soyad",
                table: "User",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            // Step 2: Migrate data - split AdSoyad into Ad and Soyad
            migrationBuilder.Sql(@"
                UPDATE ""User"" 
                SET ""Ad"" = SPLIT_PART(""AdSoyad"", ' ', 1),
                    ""Soyad"" = CASE 
                        WHEN POSITION(' ' IN ""AdSoyad"") > 0 
                        THEN SUBSTRING(""AdSoyad"" FROM POSITION(' ' IN ""AdSoyad"") + 1)
                        ELSE ''
                    END
            ");

            // Step 3: Set default values for any nulls
            migrationBuilder.Sql(@"
                UPDATE ""User"" SET ""Ad"" = 'Bilinmeyen' WHERE ""Ad"" IS NULL OR ""Ad"" = '';
                UPDATE ""User"" SET ""Soyad"" = 'Kullanıcı' WHERE ""Soyad"" IS NULL OR ""Soyad"" = '';
            ");

            // Step 4: Make columns required
            migrationBuilder.AlterColumn<string>(
                name: "Ad",
                table: "User",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Soyad",
                table: "User",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            // Step 5: Drop old column
            migrationBuilder.DropColumn(
                name: "AdSoyad",
                table: "User");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ad",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Soyad",
                table: "User");

            migrationBuilder.AddColumn<string>(
                name: "AdSoyad",
                table: "User",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
