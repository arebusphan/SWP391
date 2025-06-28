using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;

namespace DAL.Incident
{
    public interface IIncidentRepository
    {
        Task<IncidentDTO> AddAsync(IncidentDTO incidentDto);
        Task<List<IncidentSuppliesDTO>> GetAllIncidentSuppliesHistoryAsync();
        Task<Students> GetStudentWithGuardianAndClassAsync(int studentId);
        Task<IncidentDTO> GetByIdAsync(int id);
        Task<List<IncidentDTO>> GetIncidentsByGuardianIdAsync(int guardianId);

    }
}
