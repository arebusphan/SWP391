﻿using System;
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
        public DbSet<HealthEventSupply> HealthEventSupplies { get; set; }

        
       
        public DbSet<MedicalSupply> MedicalSupplies { get; set; }

        public DbSet<ConsultationAppointments> ConsultationAppointments { get; set; }
        public DbSet<Banners> Banners { get; set; }
        public DbSet<HealthProfile> HealthProfiles { get; set; }


        public DbSet<HealthNotification> HealthNotifications { get; set; }
        public DbSet<NotificationClass> NotificationClasses { get; set; }

        public DbSet<NotificationStudent> NotificationStudents { get; set; }
       
       public DbSet<MedicalSupplies> medicalSupplies { get; set; }
        public DbSet<MedicalIncidents> MedicalIncidents { get; set; }


        public DbSet<VaccinationResults> VaccinationResults { get; set; }

        public DbSet<Classes> Classes { get; set; }
        public DbSet<MedicationIntakeLog> MedicationIntakeLogs { get; set; }
        public DbSet<IncidentSupplies> IncidentSupplies { get; set; }

        public DbSet<Blog> Blog { get; set; }
    }
}
