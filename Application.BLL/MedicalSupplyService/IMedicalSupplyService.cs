public interface IMedicalSupplyService
{
    Task AddSupplyAsync(MedicalSupplyDto dto);
    Task<List<MedicalSupplyDto>> GetAllSuppliesAsync();
}
                               