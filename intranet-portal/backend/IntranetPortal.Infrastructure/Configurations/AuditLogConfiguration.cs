using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for AuditLog table
/// Tracks all critical operations in the system
/// Reference: ERD.md - Section 5.7
/// </summary>
public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        // Table name
        builder.ToTable("AuditLog");

        // Primary key
        builder.HasKey(al => al.LogID);

        // Properties configuration
        builder.Property(al => al.LogID)
            .HasColumnName("LogID")
            .ValueGeneratedOnAdd();

        builder.Property(al => al.UserID)
            .HasColumnName("UserID");

        builder.Property(al => al.Action)
            .HasColumnName("Action")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(al => al.Resource)
            .HasColumnName("Resource")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(al => al.BirimID)
            .HasColumnName("BirimID");

        builder.Property(al => al.Details)
            .HasColumnName("Details")
            .HasColumnType("jsonb"); // PostgreSQL JSON column

        builder.Property(al => al.IPAddress)
            .HasColumnName("IPAddress")
            .HasMaxLength(45); // IPv6 support

        builder.Property(al => al.TarihSaat)
            .HasColumnName("TarihSaat")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Relationships (nullable foreign keys for deleted users/units)
        builder.HasOne(al => al.User)
            .WithMany()
            .HasForeignKey(al => al.UserID)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("fk_auditlog_user");

        builder.HasOne(al => al.Birim)
            .WithMany()
            .HasForeignKey(al => al.BirimID)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("fk_auditlog_birim");

        // Performance indexes for querying audit logs
        builder.HasIndex(al => al.UserID)
            .HasDatabaseName("idx_auditlog_user");

        builder.HasIndex(al => al.BirimID)
            .HasDatabaseName("idx_auditlog_birim");

        builder.HasIndex(al => al.Action)
            .HasDatabaseName("idx_auditlog_action");

        builder.HasIndex(al => al.TarihSaat)
            .HasDatabaseName("idx_auditlog_tarih");

        // Composite index for common queries (user + date range)
        builder.HasIndex(al => new { al.UserID, al.TarihSaat })
            .HasDatabaseName("idx_auditlog_user_tarih");
    }
}
