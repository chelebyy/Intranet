using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for Permission table
/// Reference: ERD.md - Section 5.4
/// </summary>
public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        // Table name
        builder.ToTable("Permission");

        // Primary key
        builder.HasKey(p => p.PermissionID);

        // Properties configuration
        builder.Property(p => p.PermissionID)
            .HasColumnName("PermissionID")
            .ValueGeneratedOnAdd();

        builder.Property(p => p.Action)
            .HasColumnName("Action")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.Resource)
            .HasColumnName("Resource")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.Description)
            .HasColumnName("Description")
            .HasMaxLength(255);

        // Unique constraint on Action + Resource combination
        builder.HasIndex(p => new { p.Action, p.Resource })
            .IsUnique()
            .HasDatabaseName("idx_permission_action_resource");
    }
}
