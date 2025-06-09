using DAL.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class BannersController : ControllerBase
{
    private readonly IBannerService _bannerService;

    public BannersController(IBannerService bannerService)
    {
        _bannerService = bannerService;
    }

    [HttpGet("getall")]
    public async Task<ActionResult<IEnumerable<Banners>>> GetBanners()
    {
        var banners = await _bannerService.GetAllAsync();
        return Ok(banners);
    }

    [HttpGet("getbyid")]
    public async Task<ActionResult<Banners>> GetBanner(int id)
    {
        var banner = await _bannerService.GetByIdAsync(id);
        if (banner == null) return NotFound();
        return Ok(banner);
    }

    [HttpPost("post")]
    public async Task<ActionResult<Banners>> CreateBanner(Banners banner)
    {
        var created = await _bannerService.CreateAsync(banner);
        return CreatedAtAction(nameof(GetBanner), new { id = created.id }, created);
    }

    
}
