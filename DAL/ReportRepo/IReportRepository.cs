using DAL.Models.ReportDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.ReportRepo
{
    public interface IReportRepository
    {
        List<MedicationGroupDto> GetMedicationStatusByClass();
        List<VaccineConsentGroupDto> GetVaccineConsentByClass();
        List<VaccineStatusGroupDto> GetVaccineStatusByClass();
        List<HealthCheckGroupDto> GetHealthCheckSummaryByClass();
        List<IncidentGroupDto> GetMedicalIncidentsByClass();
    }
}
