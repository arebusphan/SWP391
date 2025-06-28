using BLL.Interfaces;
using BLL.UserService;
using DAL.Models;
using OfficeOpenXml;

namespace BLL.ExcelService
{
    public class ExcelService : IExcelService
    {
        private readonly IUserService _userService;
        private readonly IClassesService _classService;

        public ExcelService(IUserService userService, IClassesService classService)
        {
            _userService = userService;
            _classService = classService;
        }

        public async Task<ExcelResult> ProcessExcelAsync(Stream fileStream)
        {
            var importRows = await ReadExcelAsync(fileStream);
            var errors = new List<ExcelError>();
            int successCount = 0;

            foreach (var row in importRows)
            {
                try
                {
                    // ✅ Validate dữ liệu
                    ValidateRow(row);

                    // ✅ Kiểm tra user trùng (Phone or Email)
                    var existingUser = await _userService.FindUserByEmailOrPhoneAsync(row.PhoneNumber, row.Email);
                    if (existingUser != null)
                        throw new Exception("User with the same phone number or email already exists.");

                    // ✅ Lấy ClassId nếu là Parent
                    int? classId = null;
                    if (row.Role.ToLower() == "parent" && !string.IsNullOrWhiteSpace(row.ClassName))
                    {
                        classId = await _classService.GetClassIdByNameAsync(row.ClassName);
                        if (classId == null)
                            throw new Exception($"Class '{row.ClassName}' not found");
                    }

                    // ✅ Tạo DTO
                    var userDto = new ParentWithStudentDTO
                    {
                        Parent = new UserDTO
                        {
                            FullName = row.FullName,
                            PhoneNumber = row.PhoneNumber,
                            Email = row.Email,
                            RoleId = GetRoleIdFromRoleName(row.Role),
                            IsActive = true
                        },
                        Students = row.Role.ToLower() == "parent"
                            ? new List<StudentAddDTO>
                            {
                                new StudentAddDTO
                                {
                                    FullName = row.StudentFullName!,
                                    DateOfBirth = row.StudentDateOfBirth!.Value,
                                    Gender = row.StudentGender ?? "Unknown",
                                    ClassId = classId ?? throw new Exception("Missing class ID")
                                }
                            }
                            : null
                    };

                    await _userService.CreateUserAsync(userDto);
                    successCount++;
                }
                catch (Exception ex)
                {
                    errors.Add(new ExcelError
                    {
                        RowNumber = row.ExcelRowNumber,
                        FullName = row.FullName,
                        PhoneNumber = row.PhoneNumber,
                        Email = row.Email,
                        Role = row.Role,
                        StudentFullName = row.StudentFullName,
                        StudentDateOfBirth = row.StudentDateOfBirth,
                        StudentGender = row.StudentGender,
                        ClassName = row.ClassName,
                        Message = ex.Message
                    });
                }
            }

            string? errorFileUrl = null;
            if (errors.Any())
            {
                errorFileUrl = ExportErrors(errors);
            }

            return new ExcelResult
            {
                TotalRows = importRows.Count,
                SuccessCount = successCount,
                ErrorFileUrl = errorFileUrl
            };
        }

        private async Task<List<ImportExcelDTO>> ReadExcelAsync(Stream fileStream)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            var result = new List<ImportExcelDTO>();
            using (var package = new ExcelPackage(fileStream))
            {
                var sheet = package.Workbook.Worksheets.FirstOrDefault();
                if (sheet == null)
                    return result;

                int rows = sheet.Dimension.Rows;

                for (int row = 2; row <= rows; row++)
                {
                    var dto = new ImportExcelDTO
                    {
                        ExcelRowNumber = row,
                        FullName = sheet.Cells[row, 1].Text.Trim(),
                        PhoneNumber = sheet.Cells[row, 2].Text.Trim(),
                        Email = sheet.Cells[row, 3].Text.Trim(),
                        Role = sheet.Cells[row, 4].Text.Trim(),
                        StudentFullName = sheet.Cells[row, 5].Text.Trim(),
                        StudentDateOfBirth = DateTime.TryParse(sheet.Cells[row, 6].Text.Trim(), out var dob) ? dob : null,
                        StudentGender = sheet.Cells[row, 7].Text.Trim(),
                        ClassName = sheet.Cells[row, 8].Text.Trim()
                    };

                    result.Add(dto);
                }
            }

            return result;
        }

        private void ValidateRow(ImportExcelDTO row)
        {
            if (string.IsNullOrWhiteSpace(row.FullName))
                throw new Exception("Full name is required.");

            if (string.IsNullOrWhiteSpace(row.PhoneNumber))
                throw new Exception("Phone number is required.");

            if (string.IsNullOrWhiteSpace(row.Role))
                throw new Exception("Role is required.");

            if (row.Role.ToLower() == "parent")
            {
                if (string.IsNullOrWhiteSpace(row.StudentFullName))
                    throw new Exception("Student full name is required for parent.");

                if (row.StudentDateOfBirth == null)
                    throw new Exception("Student date of birth is required for parent.");

                if (string.IsNullOrWhiteSpace(row.ClassName))
                    throw new Exception("Class name is required for parent.");
            }
        }

        private string ExportErrors(List<ExcelError> errors)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            var fileName = $"import_errors_{DateTime.Now:yyyyMMddHHmmss}.xlsx";
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "TempStorage");
            Directory.CreateDirectory(folderPath);
            var filePath = Path.Combine(folderPath, fileName);

            using (var package = new ExcelPackage())
            {
                var sheet = package.Workbook.Worksheets.Add("Errors");

                // Header
                sheet.Cells[1, 1].Value = "RowNumber";
                sheet.Cells[1, 2].Value = "FullName";
                sheet.Cells[1, 3].Value = "PhoneNumber";
                sheet.Cells[1, 4].Value = "Email";
                sheet.Cells[1, 5].Value = "Role";
                sheet.Cells[1, 6].Value = "StudentFullName";
                sheet.Cells[1, 7].Value = "StudentDateOfBirth";
                sheet.Cells[1, 8].Value = "StudentGender";
                sheet.Cells[1, 9].Value = "ClassName";
                sheet.Cells[1, 10].Value = "Message";

                // Data rows
                for (int i = 0; i < errors.Count; i++)
                {
                    var e = errors[i];
                    int row = i + 2;
                    sheet.Cells[row, 1].Value = e.RowNumber;
                    sheet.Cells[row, 2].Value = e.FullName;
                    sheet.Cells[row, 3].Value = e.PhoneNumber;
                    sheet.Cells[row, 4].Value = e.Email;
                    sheet.Cells[row, 5].Value = e.Role;
                    sheet.Cells[row, 6].Value = e.StudentFullName;
                    sheet.Cells[row, 7].Value = e.StudentDateOfBirth?.ToString("yyyy-MM-dd");
                    sheet.Cells[row, 8].Value = e.StudentGender;
                    sheet.Cells[row, 9].Value = e.ClassName;
                    sheet.Cells[row, 10].Value = e.Message;
                }

                package.SaveAs(new FileInfo(filePath));
            }

            return $"/api/User/download-error/{fileName}";
        }

        private int GetRoleIdFromRoleName(string role)
        {
            return role.ToLower() switch
            {
                "admin" => 1,
                "parent" => 2,
                "medicalstaff" => 3,
                "manager" => 4,
                _ => throw new Exception("Invalid role: " + role)
            };
        }
    }
}
