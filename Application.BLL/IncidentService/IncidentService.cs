using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Incident;
using DAL.Models;

namespace BLL.IncidentService
{
    public class IncidentService : IIncidentService
    {
        private readonly IIncidentRepository _repository;

        public IncidentService(IIncidentRepository repository) {
        _repository = repository;
        }
        public async Task<MedicalIncidents> AddAsync(IncidentDTO incident)
        {
            return await _repository.AddAsync(incident);
        }
    }
}
