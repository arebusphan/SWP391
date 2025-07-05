using DAL.Models.ReportDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ReportService
{
    public interface IReportService
    {
        ReportDataDto GetMedicationReport();
        ReportDataDto GetVaccineConsentReport();
        ReportDataDto GetVaccineStatusReport();
        ReportDataDto GetHealthCheckReport();
        ReportDataDto GetIncidentReport();
    }
}
