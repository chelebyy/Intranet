using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for Birim (Unit/Department) table
/// Reference: ERD.md - Section 5.2
/// </summary>
public class BirimConfiguration : IEntityTypeConfiguration<Birim>
{
    public void Configure(EntityTypeBuilder<Birim> builder)
    {
        // Table name
        builder.ToTable("Birim");

        // Primary key
        builder.HasKey(b => b.BirimID);

        // Properties configuration
        builder.Property(b => b.BirimID)
            .HasColumnName("BirimID")
            .ValueGeneratedOnAdd();

        builder.Property(b => b.BirimAdi)
            .HasColumnName("BirimAdi")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(b => b.Aciklama)
            .HasColumnName("Aciklama")
            .HasMaxLength(500);

        builder.Property(b => b.IsActive)
            .HasColumnName("IsActive")
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(b => b.CreatedAt)
            .HasColumnName("CreatedAt")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Indexes
        builder.HasIndex(b => b.IsActive)
            .HasDatabaseName("idx_birim_active");
    }
}
