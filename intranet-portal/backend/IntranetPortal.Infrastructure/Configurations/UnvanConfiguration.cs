using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for Unvan (Title/Position) table
/// </summary>
public class UnvanConfiguration : IEntityTypeConfiguration<Unvan>
{
    public void Configure(EntityTypeBuilder<Unvan> builder)
    {
        // Table name
        builder.ToTable("Unvan");

        // Primary key
        builder.HasKey(u => u.UnvanID);

        // Properties configuration
        builder.Property(u => u.UnvanID)
            .HasColumnName("UnvanID")
            .ValueGeneratedOnAdd();

        builder.Property(u => u.UnvanAdi)
            .HasColumnName("UnvanAdi")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.Aciklama)
            .HasColumnName("Aciklama")
            .HasMaxLength(500);

        builder.Property(u => u.IsActive)
            .HasColumnName("IsActive")
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(u => u.CreatedAt)
            .HasColumnName("CreatedAt")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("UpdatedAt")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Indexes
        builder.HasIndex(u => u.UnvanAdi)
            .IsUnique()
            .HasDatabaseName("idx_unvan_adi_unique");

        builder.HasIndex(u => u.IsActive)
            .HasDatabaseName("idx_unvan_active");
    }
}
