using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;

namespace DAL
{
    public interface IMedicalSuppliesRepository
    {
        Task<MedicalSupplies> AddAsync(MedicalSuppliesDTO supplies);
        Task<List<MedicalSupplies>> GetAllAsync();
        Task<MedicalSupplies> UpdateAsync(UpdateSuppliesDTO supplies);
    }
}
