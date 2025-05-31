using BLL.AuthService;
using DAL;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using BLL.OtpService;
using BLL.StudentService;
using BLL.HealthCheckService;
using BLL.MedicationService;
namespace WebApplication6;

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
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<OtpService>();
        builder.Services.AddScoped<IStudentService, StudentService>();
        builder.Services.AddScoped<IHealthCheckService, HealthCheckService>();
        builder.Services.AddScoped<IMedicationService, MedicationService>();
       





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
                    policy.WithOrigins("http://localhost:5678")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
        });

        var app = builder.Build();

        
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowFrontend");

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.Run();
    }
}
