﻿public interface IVaccinationResultRepository
{
    Task SaveResultAsync(VaccinationResults result);
    Task<List<VaccinationResultVM>> GetResultsByNotificationAsync(int notificationId, int classId);
    Task<List<VaccinationResultVM>> GetResultsByGuardianAsync(int guardianId);
}