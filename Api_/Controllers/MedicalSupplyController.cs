using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MedicalSupplyController : ControllerBase
{
    private readonly IMedicalSupplyService _service;

    public MedicalSupplyController(IMedicalSupplyService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] MedicalSupplyDto dto)
    {
        await _service.AddSupplyAsync(dto);
        return Ok(new { message = "Supply added." });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllSuppliesAsync();
        return Ok(result);
    }
}
