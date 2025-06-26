using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;

namespace BLL.IncidentService
{
    public interface IIncidentService
    {
        Task<IncidentDTO> AddAsync(IncidentDTO incidentDto);
        Task<List<IncidentSuppliesDTO>> GetAllIncidentSuppliesHistoryAsync();
        Task<string> SendEmailToGuardianAsync(IncidentDTO dto);
        Task<IncidentDTO> GetByIdAsync(int id);
        Task<List<IncidentDTO>> GetIncidentsByGuardianIdAsync(int guardianId);

    }
}
