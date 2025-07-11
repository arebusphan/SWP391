using Microsoft.AspNetCore.Mvc;

namespace Api_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public NewsController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "SchoolHealthApp"); 
        }

        [HttpGet("health")]
        public async Task<IActionResult> GetHealthNews()
        {
            var apiKey = "897ed10279ad4d5aaec3c5718922af54";
            var url = $"https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey={apiKey}";

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest($"NewsAPI failed: {error}");
            }

            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
    }
}
