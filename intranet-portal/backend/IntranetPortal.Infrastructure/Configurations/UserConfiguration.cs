using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IntranetPortal.Infrastructure.Configurations;

/// <summary>
/// Entity configuration for User table
/// Reference: ERD.md - Section 5.1
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Table name with PostgreSQL quote-delimited naming
        builder.ToTable("User");

        // Primary key
        builder.HasKey(u => u.UserID);

        // Properties configuration
        builder.Property(u => u.UserID)
            .HasColumnName("UserID")
            .ValueGeneratedOnAdd();

        builder.Property(u => u.Ad)
            .HasColumnName("Ad")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(u => u.Soyad)
            .HasColumnName("Soyad")
            .HasMaxLength(50)
            .IsRequired();

        // Ignore computed property
        builder.Ignore(u => u.AdSoyad);

        builder.Property(u => u.Sicil)
            .HasColumnName("Sicil")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(u => u.SifreHash)
            .HasColumnName("SifreHash")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(u => u.Unvan)
            .HasColumnName("Unvan")
            .HasMaxLength(100);

        builder.Property(u => u.SonGiris)
            .HasColumnName("SonGiris")
            .HasColumnType("timestamp without time zone");

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

        // Indexes for performance
        builder.HasIndex(u => u.Sicil)
            .IsUnique()
            .HasDatabaseName("idx_user_sicil");

        builder.HasIndex(u => u.IsActive)
            .HasDatabaseName("idx_user_active");

        // Relationships will be configured in UserBirimRoleConfiguration
    }
}
