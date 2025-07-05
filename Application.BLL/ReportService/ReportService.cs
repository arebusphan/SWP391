using DAL.Models.ReportDTO;
using DAL.ReportRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ReportService
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repository;

        public ReportService(IReportRepository repository)
        {
            _repository = repository;
        }

        public ReportDataDto GetMedicationReport()
        {
            var list = _repository.GetMedicationStatusByClass();
            var statuses = list.Select(x => x.Status).Distinct().ToList();

            var bar = list
                .GroupBy(x => x.ClassName)
                .Select(g =>
                {
                    var dict = new Dictionary<string, object> { { "name", g.Key } };
                    foreach (var status in statuses)
                        dict[status] = g.Where(x => x.Status == status).Sum(x => x.Count);
                    return dict;
                }).ToList();

            var pie = statuses
                .Select(s => new PieItemDto
                {
                    Name = s,
                    Value = list.Where(x => x.Status == s).Sum(x => x.Count)
                }).ToList();

            return new ReportDataDto { Bar = bar, Pie = pie };
        }

        public ReportDataDto GetVaccineConsentReport()
        {
            var list = _repository.GetVaccineConsentByClass();
            var statuses = list.Select(x => x.ConfirmStatus).Distinct().ToList();

            var bar = list
                .GroupBy(x => x.ClassName)
                .Select(g =>
                {
                    var dict = new Dictionary<string, object> { { "name", g.Key } };
                    foreach (var status in statuses)
                        dict[status] = g.Where(x => x.ConfirmStatus == status).Sum(x => x.Count);
                    return dict;
                }).ToList();

            var pie = statuses
                .Select(s => new PieItemDto
                {
                    Name = s,
                    Value = list.Where(x => x.ConfirmStatus == s).Sum(x => x.Count)
                }).ToList();

            return new ReportDataDto { Bar = bar, Pie = pie };
        }

        public ReportDataDto GetVaccineStatusReport()
        {
            var list = _repository.GetVaccineStatusByClass();
            var statuses = list.Select(x => x.Status).Distinct().ToList();

            var bar = list
                .GroupBy(x => x.ClassName)
                .Select(g =>
                {
                    var dict = new Dictionary<string, object> { { "name", g.Key } };
                    foreach (var status in statuses)
                        dict[status] = g.Where(x => x.Status == status).Sum(x => x.Count);
                    return dict;
                }).ToList();

            var pie = statuses
                .Select(s => new PieItemDto
                {
                    Name = s,
                    Value = list.Where(x => x.Status == s).Sum(x => x.Count)
                }).ToList();

            return new ReportDataDto { Bar = bar, Pie = pie };
        }

        public ReportDataDto GetHealthCheckReport()
        {
            var list = _repository.GetHealthCheckSummaryByClass();
            var statuses = list.Select(x => x.ResultCategory).Distinct().ToList();

            var bar = list
                .GroupBy(x => x.ClassName)
                .Select(g =>
                {
                    var dict = new Dictionary<string, object> { { "name", g.Key } };
                    foreach (var status in statuses)
                        dict[status] = g.Where(x => x.ResultCategory == status).Sum(x => x.Count);
                    return dict;
                }).ToList();

            var pie = statuses
                .Select(s => new PieItemDto
                {
                    Name = s,
                    Value = list.Where(x => x.ResultCategory == s).Sum(x => x.Count)
                }).ToList();

            return new ReportDataDto { Bar = bar, Pie = pie };
        }

        public ReportDataDto GetIncidentReport()
        {
            var list = _repository.GetMedicalIncidentsByClass();
            var statuses = list.Select(x => x.IncidentType).Distinct().ToList();

            var bar = list
                .GroupBy(x => x.ClassName)
                .Select(g =>
                {
                    var dict = new Dictionary<string, object> { { "name", g.Key } };
                    foreach (var status in statuses)
                        dict[status] = g.Where(x => x.IncidentType == status).Sum(x => x.Count);
                    return dict;
                }).ToList();

            var pie = statuses
                .Select(s => new PieItemDto
                {
                    Name = s,
                    Value = list.Where(x => x.IncidentType == s).Sum(x => x.Count)
                }).ToList();

            return new ReportDataDto { Bar = bar, Pie = pie };
        }
    }
}
