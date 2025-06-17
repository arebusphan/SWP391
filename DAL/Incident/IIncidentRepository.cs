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
        Task<MedicalIncident> AddAsync(IncidentDTO incident);
    }
}
