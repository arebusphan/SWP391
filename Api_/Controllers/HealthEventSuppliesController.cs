using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class HealthEventSuppliesController : ControllerBase
{
    private readonly IHealthEventSupplyService _service;

    public HealthEventSuppliesController(IHealthEventSupplyService service)
    {
        _service = service;
    }

    [HttpGet("Get_All")]
    public async Task<ActionResult<IEnumerable<HealthEventSupplyDTO>>> GetAll()
    {
        var supplies = await _service.GetAllSuppliesAsync();
        return Ok(supplies);
    }

    [HttpGet("Get_By_Event_Id")]
    public async Task<ActionResult<IEnumerable<HealthEventSupplyDTO>>> GetByEventId(int eventId)
    {
        var supplies = await _service.GetSuppliesByEventIdAsync(eventId);
        return Ok(supplies);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HealthEventSupplyDTO dto)
    {
        await _service.RecordHealthEventSupplyAsync(dto);
        return Ok();
    }

    [HttpPut("Update")]
    public async Task<IActionResult> Update(int id, [FromBody] HealthEventSupplyDTO dto)
    {
        dto.EventSupplyId = id;
        await _service.UpdateHealthEventSupplyAsync(dto);
        return Ok();
    }

    [HttpPut("Delete")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteHealthEventSupplyAsync(id);
        return Ok();
    }
}