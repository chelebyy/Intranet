using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for Role table
/// Reference: ERD.md - Section 5.3
/// </summary>
public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        // Table name
        builder.ToTable("Role");

        // Primary key
        builder.HasKey(r => r.RoleID);

        // Properties configuration
        builder.Property(r => r.RoleID)
            .HasColumnName("RoleID")
            .ValueGeneratedOnAdd();

        builder.Property(r => r.RoleAdi)
            .HasColumnName("RoleAdi")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(r => r.Aciklama)
            .HasColumnName("Aciklama")
            .HasMaxLength(255);

        builder.Property(r => r.CreatedAt)
            .HasColumnName("CreatedAt")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Index for unique role name
        builder.HasIndex(r => r.RoleAdi)
            .IsUnique()
            .HasDatabaseName("idx_role_adi");
    }
}
