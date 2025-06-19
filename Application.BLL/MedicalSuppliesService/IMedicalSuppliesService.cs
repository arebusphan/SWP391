using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;

namespace BLL.MedicalSuppliesService
{
    public interface IMedicalSuppliesService
    {
        Task<MedicalSupplies> AddAsync(MedicalSuppliesDTO supplies);
        Task<List<MedicalSupplies>> GetAllAsync();
        Task<MedicalSupplies> UpdateAsync(UpdateSuppliesDTO supplies);
    }
}
