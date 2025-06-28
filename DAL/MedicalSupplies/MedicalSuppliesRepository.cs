using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using DAL.Models;
using Microsoft.EntityFrameworkCore;
namespace DAL
{
    public class MedicalSuppliesRepository : IMedicalSuppliesRepository
    {
        private readonly AppDbContext _context;

        public MedicalSuppliesRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MedicalSupplies> AddAsync(MedicalSuppliesDTO supplies)
        {
            var entity = new MedicalSupplies()
            {
                SupplyName = supplies.SupplyName,
                Quantity = supplies.Quantity,
                LastUsedAt = null,
                Notes = supplies.Notes,
                Image = supplies.Image,

            };
            _context.medicalSupplies.Add(entity);
            await _context.SaveChangesAsync();
            return entity;

        }
        public async Task<List<MedicalSupplies>> GetAllAsync()
        {
            return await _context.medicalSupplies.ToListAsync();
        }
        public async Task<MedicalSupplies> UpdateAsync(UpdateSuppliesDTO supplies)
        {
            var entity = await _context.medicalSupplies
                .FirstOrDefaultAsync(x => x.SupplyId == supplies.SupplyId);

            if (entity == null)
                throw new Exception($"Không tìm thấy vật tư với ID = {supplies.SupplyId}");

            if (supplies.Quantity.HasValue)
            {
                var quantityToTru = supplies.Quantity.Value;

                if (quantityToTru > entity.Quantity)
                    throw new Exception("Số lượng trong kho không đủ!");

                entity.Quantity -= quantityToTru;
            }

            await _context.SaveChangesAsync();
            return entity;
        }

    }
}
