using BLL;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace API_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticleController : ControllerBase
    {
        private readonly BlogService _service;

        public ArticleController(BlogService service)
        {
            _service = service;
        }

        [HttpPost("Post")]
        public async Task<IActionResult> Create([FromBody] BlogDTO dto)
        {
            var result = await _service.CreateArticleAsync(dto);
            return Ok(result);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetAll()
        {
            var articles = await _service.GetAllAsync();
            return Ok(articles);
        }

        [HttpGet("get{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var article = await _service.GetByIdAsync(id);
            if (article == null) return NotFound();
            return Ok(article);
        }
    }

}
