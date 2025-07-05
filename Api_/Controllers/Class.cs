using BLL.ReportService;
using DAL.Models.ReportDTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("medication")]
        public ActionResult<ReportDataDto> GetMedicationReport()
        {
            var result = _reportService.GetMedicationReport();
            return Ok(result);
        }

        [HttpGet("vaccine-consent")]
        public ActionResult<ReportDataDto> GetVaccineConsentReport()
        {
            var result = _reportService.GetVaccineConsentReport();
            return Ok(result);
        }

        [HttpGet("vaccine-status")]
        public ActionResult<ReportDataDto> GetVaccineStatusReport()
        {
            var result = _reportService.GetVaccineStatusReport();
            return Ok(result);
        }

        [HttpGet("healthcheck")]
        public ActionResult<ReportDataDto> GetHealthCheckReport()
        {
            var result = _reportService.GetHealthCheckReport();
            return Ok(result);
        }

        [HttpGet("incident")]
        public ActionResult<ReportDataDto> GetIncidentReport()
        {
            var result = _reportService.GetIncidentReport();
            return Ok(result);
        }
    }
}
