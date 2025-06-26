using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using DAL.Incident;
using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace BLL.IncidentService
{
    public class IncidentService : IIncidentService
    {
        private readonly IIncidentRepository _repository;

        public IncidentService(IIncidentRepository repository)
        {
            _repository = repository;
        }

        
        public async Task<IncidentDTO> AddAsync(IncidentDTO incidentDto)
        {
           
            var result = await _repository.AddAsync(incidentDto);

            
            var emailResult = await SendEmailToGuardianAsync(incidentDto);
            Console.WriteLine("Kết quả gửi email: " + emailResult);

            return result;
        }

        public async Task<List<IncidentSuppliesDTO>> GetAllIncidentSuppliesHistoryAsync()
        {
            return await _repository.GetAllIncidentSuppliesHistoryAsync();
        }

    
        public async Task<string> SendEmailToGuardianAsync(IncidentDTO dto)
        {
            try
            {

                if (!dto.StudentId.HasValue)
                    throw new Exception("StudentId is required.");

                var student = await _repository.GetStudentWithGuardianAndClassAsync(dto.StudentId.Value);
                if (student == null || string.IsNullOrEmpty(student.Guardian?.Email))
                    return "Không tìm thấy học sinh hoặc email người giám hộ.";

                var toEmail = student.Guardian.Email;
                var fromEmail = "dungarebus@gmail.com"; 
                var appPassword = "upuh qnjm qbct pryp"; 

                var client = new SmtpClient("smtp.gmail.com", 587)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(fromEmail, appPassword)
                };

     
                var body = new StringBuilder();
                body.AppendLine("📋 THÔNG BÁO SỰ CỐ Y TẾ");
                body.AppendLine($"👦 Học sinh: {student.FullName}");
                body.AppendLine($"🏫 Lớp: {student.Class?.ClassName}");
                body.AppendLine($"⚠️ Sự cố: {dto.IncidentName}");
                body.AppendLine($"📝 Mô tả: {dto.Description}");
                body.AppendLine($"👩‍⚕️ Người xử lý: {dto.HandledBy}");
                body.AppendLine($"🕒 Thời gian: {(dto.OccurredAt ?? DateTime.Now):dd/MM/yyyy HH:mm}");

           
                var mail = new MailMessage(fromEmail, toEmail)
                {
                    Subject = "Thông báo sự cố y tế học sinh",
                    Body = body.ToString(),
                    IsBodyHtml = false
                };

        
                await client.SendMailAsync(mail);
                return "Email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Gửi email thất bại: {ex.Message}";
            }
        }
        public async Task<IncidentDTO> GetByIdAsync(int id)
        {
    
            return await _repository.GetByIdAsync(id);
        }
        public async Task<List<IncidentDTO>> GetIncidentsByGuardianIdAsync(int guardianId)
        {
            return await _repository.GetIncidentsByGuardianIdAsync(guardianId);
        }
    }
}
