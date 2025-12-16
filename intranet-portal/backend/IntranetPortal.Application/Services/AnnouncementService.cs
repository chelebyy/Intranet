using IntranetPortal.Application.DTOs.Announcements;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntranetPortal.Application.Services
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly IIntranetDbContext _context;

        public AnnouncementService(IIntranetDbContext context)
        {
            _context = context;
        }

        public async Task<AnnouncementDto> CreateAsync(CreateAnnouncementDto dto, int createdByUserId)
        {
            var announcement = new Announcement
            {
                Title = dto.Title,
                Content = dto.Content,
                Type = dto.Type,
                DisplayType = dto.DisplayType,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Priority = dto.Priority,
                CreatedByUserId = createdByUserId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                Targets = dto.Targets.Select(t => new AnnouncementTarget
                {
                    TargetType = t.TargetType,
                    TargetValue = t.TargetValue
                }).ToList()
            };

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(announcement.AnnouncementID);
        }

        public async Task<AnnouncementDto> UpdateAsync(int id, CreateAnnouncementDto dto)
        {
            var announcement = await _context.Announcements
                .Include(a => a.Targets)
                .FirstOrDefaultAsync(a => a.AnnouncementID == id);

            if (announcement == null) throw new KeyNotFoundException("Duyuru bulunamadı");

            announcement.Title = dto.Title;
            announcement.Content = dto.Content;
            announcement.Type = dto.Type;
            announcement.DisplayType = dto.DisplayType;
            announcement.StartDate = dto.StartDate;
            announcement.EndDate = dto.EndDate;
            announcement.Priority = dto.Priority;

            // Update targets (clear and re-add for simplicity)
            _context.AnnouncementTargets.RemoveRange(announcement.Targets);
            announcement.Targets = dto.Targets.Select(t => new AnnouncementTarget
            {
                TargetType = t.TargetType,
                TargetValue = t.TargetValue
            }).ToList();

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task DeleteAsync(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement != null)
            {
                // Soft delete or hard delete? Let's do Soft toggle for now or hard delete
                // Requirement said "Soft delete or deactivate"
                announcement.IsActive = false; // Soft delete
                await _context.SaveChangesAsync();
            }
        }

        public async Task<AnnouncementDto?> GetByIdAsync(int id)
        {
            var announcement = await _context.Announcements
                .Include(a => a.Targets)
                .Include(a => a.CreatedBy)
                .FirstOrDefaultAsync(a => a.AnnouncementID == id);

            if (announcement == null) return null;

            return MapToDto(announcement);
        }

        public async Task<IEnumerable<AnnouncementDto>> GetAllAnnouncementsAsync()
        {
            var list = await _context.Announcements
                .Include(a => a.Targets)
                .Include(a => a.CreatedBy)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return list.Select(MapToDto);
        }

        public async Task<IEnumerable<AnnouncementDto>> GetActiveAnnouncementsForUserAsync(int userId, int? birimId, int? roleId)
        {
            var now = DateTime.UtcNow;

            // 1. Get all active announcements within date range
            var potentialAnnouncements = await _context.Announcements
                .Include(a => a.Targets)
                .Where(a => a.IsActive && a.StartDate <= now && a.EndDate >= now)
                .ToListAsync();

            // 2. Filter in memory (easier to handle complex OR logic with child collection)
            // Or use advanced query. "Targets" collection must contain at least one match.
            // Match Logic: TargetType='All' OR (TargetType='User' AND Value=userId) ...

            var filtered = potentialAnnouncements.Where(a => a.Targets.Any(t =>
                t.TargetType == "All" ||
                (t.TargetType == "User" && t.TargetValue == userId) ||
                (t.TargetType == "Unit" && birimId.HasValue && t.TargetValue == birimId.Value) ||
                (t.TargetType == "Role" && roleId.HasValue && t.TargetValue == roleId.Value)
            )).ToList();

            // 3. Get acknowledgments for this user
            var acknowledgedIds = await _context.UserAcknowledgments
                .Where(ua => ua.UserID == userId)
                .Select(ua => ua.AnnouncementID)
                .ToListAsync();

            var dtos = filtered.Select(a =>
            {
                var dto = MapToDto(a);
                dto.IsRead = acknowledgedIds.Contains(a.AnnouncementID);
                return dto;
            });
            
            return dtos.OrderByDescending(a => a.Priority).ThenByDescending(a => a.CreatedAt);
        }

        public async Task AcknowledgeAsync(int announcementId, int userId, string ipAddress)
        {
            var existing = await _context.UserAcknowledgments
                .FirstOrDefaultAsync(ua => ua.AnnouncementID == announcementId && ua.UserID == userId);

            if (existing == null)
            {
                _context.UserAcknowledgments.Add(new UserAcknowledgment
                {
                    AnnouncementID = announcementId,
                    UserID = userId,
                    AcknowledgedAt = DateTime.UtcNow,
                    IPAddress = ipAddress
                });
                await _context.SaveChangesAsync();
            }
        }

        private static AnnouncementDto MapToDto(Announcement a)
        {
            return new AnnouncementDto
            {
                AnnouncementID = a.AnnouncementID,
                Title = a.Title,
                Content = a.Content,
                Type = a.Type,
                DisplayType = a.DisplayType,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                IsActive = a.IsActive,
                Priority = a.Priority,
                CreatedAt = a.CreatedAt,
                CreatedByName = a.CreatedBy != null ? $"{a.CreatedBy.Ad} {a.CreatedBy.Soyad}" : "Unknown",
                Targets = a.Targets.Select(t => new AnnouncementTargetDto
                {
                    TargetID = t.TargetID,
                    TargetType = t.TargetType,
                    TargetValue = t.TargetValue
                }).ToList()
            };
        }
    }
}
