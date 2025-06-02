public interface IMedicalSupplyRepository
{
    Task AddAsync(MedicalSupply supply);
    Task<List<MedicalSupply>> GetAllAsync();
}
