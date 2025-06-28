using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace BLL
{
    public class BlogService
    {
        private readonly AppDbContext _context;

        public BlogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Blog> CreateArticleAsync(BlogDTO dto)
        {
            var article = new Blog
            {
                Title = dto.Title,
                ImageUrl = dto.ImageUrl,
                HtmlContent = dto.HtmlContent,
                CreatedAt = DateTime.UtcNow
            };

            _context.Blog.Add(article);
            await _context.SaveChangesAsync();
            return article;
        }

        public async Task<List<Blog>> GetAllAsync()
        {
            return await _context.Blog.OrderByDescending(a => a.CreatedAt).ToListAsync();
        }

        public async Task<Blog?> GetByIdAsync(int id)
        {
            return await _context.Blog.FindAsync(id);
        }
    }

}
