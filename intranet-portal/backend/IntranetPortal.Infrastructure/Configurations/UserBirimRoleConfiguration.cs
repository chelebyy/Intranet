using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for UserBirimRole junction table
/// CRITICAL: This table enables multi-unit support - users can belong to multiple units with different roles
/// Reference: ERD.md - Section 5.5
/// </summary>
public class UserBirimRoleConfiguration : IEntityTypeConfiguration<UserBirimRole>
{
    public void Configure(EntityTypeBuilder<UserBirimRole> builder)
    {
        // Table name
        builder.ToTable("UserBirimRole");

        // Primary key
        builder.HasKey(ubr => ubr.ID);

        // Properties configuration
        builder.Property(ubr => ubr.ID)
            .HasColumnName("ID")
            .ValueGeneratedOnAdd();

        builder.Property(ubr => ubr.UserID)
            .HasColumnName("UserID")
            .IsRequired();

        builder.Property(ubr => ubr.BirimID)
            .HasColumnName("BirimID")
            .IsRequired();

        builder.Property(ubr => ubr.RoleID)
            .HasColumnName("RoleID")
            .IsRequired();

        builder.Property(ubr => ubr.AssignedAt)
            .HasColumnName("AssignedAt")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Relationships
        builder.HasOne(ubr => ubr.User)
            .WithMany(u => u.UserBirimRoles)
            .HasForeignKey(ubr => ubr.UserID)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_userbr_user");

        builder.HasOne(ubr => ubr.Birim)
            .WithMany(b => b.UserBirimRoles)
            .HasForeignKey(ubr => ubr.BirimID)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_userbr_birim");

        builder.HasOne(ubr => ubr.Role)
            .WithMany()
            .HasForeignKey(ubr => ubr.RoleID)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_userbr_role");

        // Unique constraint: A user can have only ONE role per unit
        builder.HasIndex(ubr => new { ubr.UserID, ubr.BirimID })
            .IsUnique()
            .HasDatabaseName("idx_userbr_user_birim");

        // Performance indexes
        builder.HasIndex(ubr => ubr.UserID)
            .HasDatabaseName("idx_userbr_user");

        builder.HasIndex(ubr => ubr.BirimID)
            .HasDatabaseName("idx_userbr_birim");

        builder.HasIndex(ubr => ubr.RoleID)
            .HasDatabaseName("idx_userbr_role");
    }
}
