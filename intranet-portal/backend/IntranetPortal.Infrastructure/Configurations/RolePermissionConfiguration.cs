using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for RolePermission junction table
/// Maps roles to their granular permissions
/// Reference: ERD.md - Section 5.6
/// </summary>
public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        // Table name
        builder.ToTable("RolePermission");

        // Primary key
        builder.HasKey(rp => rp.ID);

        // Properties configuration
        builder.Property(rp => rp.ID)
            .HasColumnName("ID")
            .ValueGeneratedOnAdd();

        builder.Property(rp => rp.RoleID)
            .HasColumnName("RoleID")
            .IsRequired();

        builder.Property(rp => rp.PermissionID)
            .HasColumnName("PermissionID")
            .IsRequired();

        builder.Property(rp => rp.GrantedAt)
            .HasColumnName("GrantedAt")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Relationships
        builder.HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleID)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_roleperm_role");

        builder.HasOne(rp => rp.Permission)
            .WithMany()
            .HasForeignKey(rp => rp.PermissionID)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_roleperm_permission");

        // Unique constraint: Each role-permission pair must be unique
        builder.HasIndex(rp => new { rp.RoleID, rp.PermissionID })
            .IsUnique()
            .HasDatabaseName("idx_roleperm_role_permission");

        // Performance indexes
        builder.HasIndex(rp => rp.RoleID)
            .HasDatabaseName("idx_roleperm_role");

        builder.HasIndex(rp => rp.PermissionID)
            .HasDatabaseName("idx_roleperm_permission");
    }
}
