using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Banners",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "text", nullable: true),
                    imageUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Banners", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Blog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    HtmlContent = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Classes",
                columns: table => new
                {
                    ClassId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClassName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Classes", x => x.ClassId);
                });

            migrationBuilder.CreateTable(
                name: "HealthNotifications",
                columns: table => new
                {
                    NotificationId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EventName = table.Column<string>(type: "text", nullable: false),
                    EventType = table.Column<string>(type: "text", nullable: false),
                    EventImage = table.Column<string>(type: "text", nullable: true),
                    EventDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthNotifications", x => x.NotificationId);
                });

            migrationBuilder.CreateTable(
                name: "medicalSupplies",
                columns: table => new
                {
                    SupplyId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SupplyName = table.Column<string>(type: "text", nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: true),
                    LastUsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    Image = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_medicalSupplies", x => x.SupplyId);
                });

            migrationBuilder.CreateTable(
                name: "MedicalSupplies",
                columns: table => new
                {
                    SupplyId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SupplyName = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalSupplies", x => x.SupplyId);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "NotificationClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NotificationId = table.Column<int>(type: "integer", nullable: true),
                    ClassId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationClasses_Classes_ClassId",
                        column: x => x.ClassId,
                        principalTable: "Classes",
                        principalColumn: "ClassId");
                    table.ForeignKey(
                        name: "FK_NotificationClasses_HealthNotifications_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "HealthNotifications",
                        principalColumn: "NotificationId");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId");
                });

            migrationBuilder.CreateTable(
                name: "Otps",
                columns: table => new
                {
                    OtpId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    ExpiredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Otps", x => x.OtpId);
                    table.ForeignKey(
                        name: "FK_Otps_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    StudentId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: false),
                    GuardianId = table.Column<int>(type: "integer", nullable: false),
                    ClassId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.StudentId);
                    table.ForeignKey(
                        name: "FK_Students_Classes_ClassId",
                        column: x => x.ClassId,
                        principalTable: "Classes",
                        principalColumn: "ClassId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Students_Users_GuardianId",
                        column: x => x.GuardianId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConsultationAppointments",
                columns: table => new
                {
                    AppointmentId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    AppointmentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsultationAppointments", x => x.AppointmentId);
                    table.ForeignKey(
                        name: "FK_ConsultationAppointments_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthChecks",
                columns: table => new
                {
                    CheckId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    CheckDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    WeightKg = table.Column<double>(type: "double precision", nullable: true),
                    HeightCm = table.Column<double>(type: "double precision", nullable: true),
                    LeftEyeVision = table.Column<double>(type: "double precision", nullable: true),
                    RightEyeVision = table.Column<double>(type: "double precision", nullable: true),
                    LeftEarHearing = table.Column<string>(type: "text", nullable: true),
                    RightEarHearing = table.Column<string>(type: "text", nullable: true),
                    SpineStatus = table.Column<string>(type: "text", nullable: true),
                    SkinStatus = table.Column<string>(type: "text", nullable: true),
                    OralHealth = table.Column<string>(type: "text", nullable: true),
                    OtherNotes = table.Column<string>(type: "text", nullable: true),
                    RecordedBy = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthChecks", x => x.CheckId);
                    table.ForeignKey(
                        name: "FK_HealthChecks_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthChecks_Users_RecordedBy",
                        column: x => x.RecordedBy,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthEvents",
                columns: table => new
                {
                    EventId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    EventType = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Execution = table.Column<string>(type: "text", nullable: false),
                    SupplyId = table.Column<int>(type: "integer", nullable: false),
                    QuantityUsed = table.Column<int>(type: "integer", nullable: false),
                    EventDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthEvents", x => x.EventId);
                    table.ForeignKey(
                        name: "FK_HealthEvents_MedicalSupplies_SupplyId",
                        column: x => x.SupplyId,
                        principalTable: "MedicalSupplies",
                        principalColumn: "SupplyId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthEvents_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthProfiles",
                columns: table => new
                {
                    DeclarationId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    Allergies = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ChronicDiseases = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Vision = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Hearing = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    OtherNotes = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    ReviewedBy = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthProfiles", x => x.DeclarationId);
                    table.ForeignKey(
                        name: "FK_HealthProfiles_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthProfiles_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthProfiles_Users_ReviewedBy",
                        column: x => x.ReviewedBy,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "MedicalIncidents",
                columns: table => new
                {
                    IncidentId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentId = table.Column<int>(type: "integer", nullable: true),
                    ClassId = table.Column<int>(type: "integer", nullable: true),
                    IncidentName = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    HandledBy = table.Column<string>(type: "text", nullable: true),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalIncidents", x => x.IncidentId);
                    table.ForeignKey(
                        name: "FK_MedicalIncidents_Classes_ClassId",
                        column: x => x.ClassId,
                        principalTable: "Classes",
                        principalColumn: "ClassId");
                    table.ForeignKey(
                        name: "FK_MedicalIncidents_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId");
                });

            migrationBuilder.CreateTable(
                name: "MedicationRequests",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    MedicineName = table.Column<string>(type: "text", nullable: false),
                    PrescriptionImage = table.Column<string>(type: "text", nullable: false),
                    HealthStatus = table.Column<string>(type: "text", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RejectReason = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    ReviewedBy = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationRequests", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK_MedicationRequests_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationRequests_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationRequests_Users_ReviewedBy",
                        column: x => x.ReviewedBy,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "NotificationStudents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NotificationId = table.Column<int>(type: "integer", nullable: false),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    ConfirmStatus = table.Column<string>(type: "text", nullable: true),
                    DeclineReason = table.Column<string>(type: "text", nullable: true),
                    ParentPhone = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationStudents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationStudents_HealthNotifications_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "HealthNotifications",
                        principalColumn: "NotificationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NotificationStudents_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VaccinationResults",
                columns: table => new
                {
                    ResultId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    NotificationId = table.Column<int>(type: "integer", nullable: false),
                    Vaccinated = table.Column<bool>(type: "boolean", nullable: true),
                    VaccinatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ObservationStatus = table.Column<string>(type: "text", nullable: true),
                    VaccinatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccinationResults", x => x.ResultId);
                    table.ForeignKey(
                        name: "FK_VaccinationResults_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthEventSupplies",
                columns: table => new
                {
                    EventSupplyId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EventId = table.Column<int>(type: "integer", nullable: false),
                    SupplyId = table.Column<int>(type: "integer", nullable: false),
                    QuantityUsed = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthEventSupplies", x => x.EventSupplyId);
                    table.ForeignKey(
                        name: "FK_HealthEventSupplies_HealthEvents_EventId",
                        column: x => x.EventId,
                        principalTable: "HealthEvents",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthEventSupplies_MedicalSupplies_SupplyId",
                        column: x => x.SupplyId,
                        principalTable: "MedicalSupplies",
                        principalColumn: "SupplyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IncidentSupplies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IncidentId = table.Column<int>(type: "integer", nullable: false),
                    SupplyId = table.Column<int>(type: "integer", nullable: false),
                    QuantityUsed = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IncidentSupplies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IncidentSupplies_MedicalIncidents_IncidentId",
                        column: x => x.IncidentId,
                        principalTable: "MedicalIncidents",
                        principalColumn: "IncidentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IncidentSupplies_medicalSupplies_SupplyId",
                        column: x => x.SupplyId,
                        principalTable: "medicalSupplies",
                        principalColumn: "SupplyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicationIntakeLogs",
                columns: table => new
                {
                    LogId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RequestId = table.Column<int>(type: "integer", nullable: false),
                    StudentId = table.Column<int>(type: "integer", nullable: false),
                    IntakeTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GivenBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Notes = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationIntakeLogs", x => x.LogId);
                    table.ForeignKey(
                        name: "FK_MedicationIntakeLogs_MedicationRequests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "MedicationRequests",
                        principalColumn: "RequestId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationIntakeLogs_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationAppointments_StudentId",
                table: "ConsultationAppointments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthChecks_RecordedBy",
                table: "HealthChecks",
                column: "RecordedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HealthChecks_StudentId",
                table: "HealthChecks",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthEvents_StudentId",
                table: "HealthEvents",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthEvents_SupplyId",
                table: "HealthEvents",
                column: "SupplyId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthEventSupplies_EventId",
                table: "HealthEventSupplies",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthEventSupplies_SupplyId",
                table: "HealthEventSupplies",
                column: "SupplyId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthProfiles_CreatedBy",
                table: "HealthProfiles",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HealthProfiles_ReviewedBy",
                table: "HealthProfiles",
                column: "ReviewedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HealthProfiles_StudentId",
                table: "HealthProfiles",
                column: "StudentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IncidentSupplies_IncidentId",
                table: "IncidentSupplies",
                column: "IncidentId");

            migrationBuilder.CreateIndex(
                name: "IX_IncidentSupplies_SupplyId",
                table: "IncidentSupplies",
                column: "SupplyId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalIncidents_ClassId",
                table: "MedicalIncidents",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalIncidents_StudentId",
                table: "MedicalIncidents",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationIntakeLogs_RequestId",
                table: "MedicationIntakeLogs",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationIntakeLogs_StudentId",
                table: "MedicationIntakeLogs",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationRequests_CreatedBy",
                table: "MedicationRequests",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationRequests_ReviewedBy",
                table: "MedicationRequests",
                column: "ReviewedBy");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationRequests_StudentId",
                table: "MedicationRequests",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationClasses_ClassId",
                table: "NotificationClasses",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationClasses_NotificationId",
                table: "NotificationClasses",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationStudents_NotificationId",
                table: "NotificationStudents",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationStudents_StudentId",
                table: "NotificationStudents",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Otps_UserId",
                table: "Otps",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_ClassId",
                table: "Students",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_GuardianId",
                table: "Students",
                column: "GuardianId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccinationResults_StudentId",
                table: "VaccinationResults",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Banners");

            migrationBuilder.DropTable(
                name: "Blog");

            migrationBuilder.DropTable(
                name: "ConsultationAppointments");

            migrationBuilder.DropTable(
                name: "HealthChecks");

            migrationBuilder.DropTable(
                name: "HealthEventSupplies");

            migrationBuilder.DropTable(
                name: "HealthProfiles");

            migrationBuilder.DropTable(
                name: "IncidentSupplies");

            migrationBuilder.DropTable(
                name: "MedicationIntakeLogs");

            migrationBuilder.DropTable(
                name: "NotificationClasses");

            migrationBuilder.DropTable(
                name: "NotificationStudents");

            migrationBuilder.DropTable(
                name: "Otps");

            migrationBuilder.DropTable(
                name: "VaccinationResults");

            migrationBuilder.DropTable(
                name: "HealthEvents");

            migrationBuilder.DropTable(
                name: "MedicalIncidents");

            migrationBuilder.DropTable(
                name: "medicalSupplies");

            migrationBuilder.DropTable(
                name: "MedicationRequests");

            migrationBuilder.DropTable(
                name: "HealthNotifications");

            migrationBuilder.DropTable(
                name: "MedicalSupplies");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
