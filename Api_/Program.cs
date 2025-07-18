
﻿using BLL;
using BLL.AuthService;
using BLL.EmailService;
using BLL.ExcelService;

using BLL.HealthCheckService;
using BLL.HealthProfile;
using BLL.IncidentService;

using BLL.Interfaces;
using BLL.MedicalSuppliesService;
using BLL.MedicationIntakeLogsService;
using BLL.MedicationService;
using BLL.OtpService;
using BLL.OverviewService;
using BLL.ReportService;
using BLL.Services;
using BLL.StudentDetailService;
using BLL.StudentService;
using BLL.UserService;
using DAL;
using DAL.EmailRepo;
using DAL.Incident;

using DAL.Interfaces;
using DAL.MedicationIntakeLogs;
using DAL.Models;
using DAL.ReportRepo;
using DAL.Repositories;
using DAL.StatisticRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace WebApplication6
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            builder.Services.AddControllers();
            builder.Services.AddAuthorization();
            builder.Services.AddEndpointsApiExplorer();


            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "School Medical API",
                    Version = "v1"
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Nhập token dạng: Bearer <token>"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


            builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
            builder.Services.AddSingleton<IEmailQueue, EmailQueue>();
            builder.Services.AddSingleton<IEmailService, EmailService>();
            builder.Services.AddHostedService<EmailSenderHostedService>();
            builder.Services.AddMemoryCache();

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<OtpService>();
            builder.Services.AddScoped<IBannerService, BannerService>();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUserService, UserService>();

            builder.Services.AddScoped<IMedicationRepository, MedicationRepository>();
            builder.Services.AddScoped<IMedicationService, MedicationService>();

            builder.Services.AddScoped<IStudentService, StudentService>();
            builder.Services.AddScoped<IStudentRepository, StudentRepository>();

            builder.Services.AddScoped<IHealthCheckRepository, HealthCheckRepository>();
            builder.Services.AddScoped<IHealthCheckService, HealthCheckService>();

            builder.Services.AddScoped<IHealthProfileService, HealthProfileService>();

            builder.Services.AddScoped<IHealthEventRepository, HealthEventRepository>();
            builder.Services.AddScoped<IHealthEventService, HealthEventService>();

            builder.Services.AddScoped<IHealthEventSupplyRepository, HealthEventSupplyRepository>();
            builder.Services.AddScoped<IHealthEventSupplyService, HealthEventSupplyService>();

            builder.Services.AddControllers();
            builder.Services.AddScoped<BlogService>();
            builder.Services.AddScoped<IIncidentRepository, IncidentRepository>();
            builder.Services.AddScoped<IIncidentService, IncidentService>();

            builder.Services.AddScoped<IMedicalSuppliesRepository, MedicalSuppliesRepository>();
            builder.Services.AddScoped<IMedicalSuppliesService, MedicalSuppliesService>();

            builder.Services.AddScoped<IHealthNotificationRepository, HealthNotificationRepository>();
            builder.Services.AddScoped<IHealthNotificationService, HealthNotificationService>();

            builder.Services.AddScoped<IStudentStatusService, StudentStatusService>();
            builder.Services.AddScoped<IStudentStatusRepository, StudentStatusRepository>();

            builder.Services.AddHttpClient();

            builder.Services.AddScoped<IStudentDetailRepository, StudentDetailRepository>();
            builder.Services.AddScoped<IStudentDetailService, StudentDetailService>();


            builder.Services.AddScoped<IHealthNotificationRepository, HealthNotificationRepository>();
            builder.Services.AddScoped<IHealthNotificationService, HealthNotificationService>();

            builder.Services.AddScoped<IStatisticService, StatisticService>();
            builder.Services.AddScoped<IStatisticRepository, StatisticRepository>();


            builder.Services.AddScoped<INotificationStudentRepository, NotificationStudentRepository>();
            builder.Services.AddScoped<INotificationStudentService, NotificationStudentService>();

            builder.Services.AddScoped<IVaccinationResultRepository, VaccinationResultRepository>();
            builder.Services.AddScoped<IVaccinationResultService, VaccinationResultService>();

            builder.Services.AddScoped<IClassesRepository, ClassesRepository>();
            builder.Services.AddScoped<IClassesService, ClassesService>();

            builder.Services.AddScoped<IMedicationIntakeLogRepo, MedicationIntakeLogRepo>();
            builder.Services.AddScoped<IMedicationIntakeLogService, MedicationIntakeLogService>();

            builder.Services.AddScoped<IReportRepository, ReportRepository>();
            builder.Services.AddScoped<IReportService, ReportService>();

            builder.Services.AddScoped<IExcelService, ExcelService>();
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["AppSettings:Issuer"],
                    ValidAudience = builder.Configuration["AppSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]))
                };
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5678",
                            "https://healthschoolmanagement.netlify.app")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            var app = builder.Build();
    

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "SWP391 API V1");
                c.RoutePrefix = "swagger";
            });

            app.UseCors("AllowFrontend");

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.Run();
        }
    }
}