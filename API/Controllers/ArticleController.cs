using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticleController : Controller
    {
        private readonly AppDbContext _context;

        public ArticleController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("create")]
        [Authorize]

        public async Task<IActionResult> createArticle([FromBody] Article newArticle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            newArticle.likesCount = 0;
            newArticle.commentsCount = 0;
            newArticle.retweetsCount = 0;
            newArticle.send_at = DateTime.Now;

            _context.Articles.Add(newArticle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArticle), new { id = newArticle.id }, newArticle);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }
            return Ok(article);
        }

        [HttpGet("getArticleByContent/")]
        public async Task<IActionResult> GetNotisByTitleStatus(string? content, int page = 1, int pageSize = 10)
        {
            var query = _context.Articles.AsQueryable();

            if (!string.IsNullOrEmpty(content))
            {
                query = query.Where(n => n.content.Contains(content));
            }

            var articles = await query
                .Join(_context.Users,
                      article => article.company_id,
                      user => user.company_id,
                      (article, user) => new ArticleDTO
                      {
                          id = article.id,
                          content = article.content,
                          imageUrl = article.imageUrl,
                          accName = user.name,
                          commentsCount = article.commentsCount,
                          likesCount = article.likesCount,
                          retweetsCount = article.retweetsCount,
                          send_at = article.send_at
                      })
                .OrderByDescending(a => a.send_at)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();


            var totalArticles = await query.CountAsync();

            var result = new
            {
                totalArticles = totalArticles,
                Articles = articles
            };

            return Ok(result);
        }
    }
}
