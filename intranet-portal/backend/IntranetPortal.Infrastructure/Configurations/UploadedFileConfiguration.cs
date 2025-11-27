using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for UploadedFile table
/// Supports polymorphic relationships with multiple entity types
/// Reference: ERD.md - Section 5.9, FILE_MANAGEMENT.md
/// </summary>
public class UploadedFileConfiguration : IEntityTypeConfiguration<UploadedFile>
{
    public void Configure(EntityTypeBuilder<UploadedFile> builder)
    {
        // Table name
        builder.ToTable("UploadedFile");

        // Primary key
        builder.HasKey(uf => uf.FileID);

        // Properties configuration
        builder.Property(uf => uf.FileID)
            .HasColumnName("FileID")
            .ValueGeneratedOnAdd();

        builder.Property(uf => uf.EntityType)
            .HasColumnName("EntityType")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(uf => uf.EntityID)
            .HasColumnName("EntityID")
            .IsRequired();

        builder.Property(uf => uf.FileName)
            .HasColumnName("FileName")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(uf => uf.FilePath)
            .HasColumnName("FilePath")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(uf => uf.MimeType)
            .HasColumnName("MimeType")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(uf => uf.FileSize)
            .HasColumnName("FileSize")
            .IsRequired();

        builder.Property(uf => uf.UploadedByUserID)
            .HasColumnName("UploadedByUserID")
            .IsRequired();

        builder.Property(uf => uf.UploadedAt)
            .HasColumnName("UploadedAt")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();

        // Relationships
        builder.HasOne(uf => uf.UploadedByUser)
            .WithMany()
            .HasForeignKey(uf => uf.UploadedByUserID)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_uploadedfile_user");

        // Indexes for polymorphic queries
        builder.HasIndex(uf => new { uf.EntityType, uf.EntityID })
            .HasDatabaseName("idx_uploadedfile_entity");

        builder.HasIndex(uf => uf.UploadedByUserID)
            .HasDatabaseName("idx_uploadedfile_user");

        builder.HasIndex(uf => uf.UploadedAt)
            .HasDatabaseName("idx_uploadedfile_date");
    }
}
