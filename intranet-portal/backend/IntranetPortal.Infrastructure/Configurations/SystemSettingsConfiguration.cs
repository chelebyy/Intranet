using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for SystemSettings table
/// Key-value store for system-wide configuration
/// Reference: ERD.md - Section 5.10, PRD.md FR-44 to FR-47
/// </summary>
public class SystemSettingsConfiguration : IEntityTypeConfiguration<SystemSettings>
{
    public void Configure(EntityTypeBuilder<SystemSettings> builder)
    {
        // Table name
        builder.ToTable("SystemSettings");

        // Primary key
        builder.HasKey(ss => ss.SettingID);

        // Properties configuration
        builder.Property(ss => ss.SettingID)
            .HasColumnName("SettingID")
            .ValueGeneratedOnAdd();

        builder.Property(ss => ss.SettingKey)
            .HasColumnName("SettingKey")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(ss => ss.SettingValue)
            .HasColumnName("SettingValue")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(ss => ss.Description)
            .HasColumnName("Description")
            .HasMaxLength(255);

        builder.Property(ss => ss.UpdatedAt)
            .HasColumnName("UpdatedAt")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Unique constraint on SettingKey
        builder.HasIndex(ss => ss.SettingKey)
            .IsUnique()
            .HasDatabaseName("idx_systemsettings_key");
    }
}
