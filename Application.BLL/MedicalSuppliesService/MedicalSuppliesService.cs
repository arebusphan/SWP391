using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using DAL.Models;

namespace BLL.MedicalSuppliesService
{
    public class MedicalSuppliesService : IMedicalSuppliesService
    {
        private readonly IMedicalSuppliesRepository _repository;

        public MedicalSuppliesService(IMedicalSuppliesRepository repository)
        {
            _repository = repository;
        }
        public async Task<MedicalSupplies> AddAsync(MedicalSuppliesDTO supplies)
        {
            return await _repository.AddAsync(supplies);
        }
        public async Task<List<MedicalSupplies>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
    }
}
