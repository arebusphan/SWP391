public class MedicalSupplyService : IMedicalSupplyService
{
    private readonly IMedicalSupplyRepository _repository;

    public MedicalSupplyService(IMedicalSupplyRepository repository)
    {
        _repository = repository;
    }

    public async Task AddSupplyAsync(MedicalSupplyDto dto)
    {
        var supply = new MedicalSupply
        {
            SupplyName = dto.SupplyName,
            Description = dto.Description
        };
        await _repository.AddAsync(supply);
    }

    public async Task<List<MedicalSupplyDto>> GetAllSuppliesAsync()
    {
        var supplies = await _repository.GetAllAsync();
        return supplies.Select(s => new MedicalSupplyDto
        {
            SupplyName = s.SupplyName,
            Description = s.Description
        }).ToList();
    }
}
