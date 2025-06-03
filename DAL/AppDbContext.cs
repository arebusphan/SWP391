using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using DAL.Models;
using static System.Net.WebRequestMethods;
using System.Data;
using System.Reflection.PortableExecutable;

namespace DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Users> Users { get; set; }
        public DbSet<Otps> Otps { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Students> Students { get; set; }
        public DbSet<HealthChecks> HealthChecks { get; set; }
        public DbSet<MedicationRequests> MedicationRequests { get; set; }

        public DbSet<HealthEvent> HealthEvents { get; set; }

        public DbSet<VaccinationRecord> VaccinationRecords { get; set; }
        public DbSet<Vaccine> Vaccines { get; set; }
        public DbSet<MedicalSupply> MedicalSupplies { get; set; }

        public DbSet<HealthNotifications> HealthNotifications { get; set; }
        public DbSet<NotificationStudents> NotificationStudents { get; set; }




    }
}
