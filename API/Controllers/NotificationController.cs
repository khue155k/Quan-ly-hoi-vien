using API.Models;
using API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestSharp;
using HtmlAgilityPack;
using Microsoft.Extensions.Configuration;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : Controller
    {
        private readonly AppDbContext _context;

        private readonly IConfiguration _configuration;

        public NotificationController(AppDbContext context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateNotification([FromBody] Notification newNotification)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            newNotification.send_at = DateTime.Now;
            newNotification.update_at = DateTime.Now;
      

            _context.Notifications.Add(newNotification);
            await _context.SaveChangesAsync();

            await PushNotification(newNotification.title, newNotification.message, newNotification.img_url);
            await SendNotificationToTele(newNotification.title, newNotification.message, newNotification.img_url);

            return CreatedAtAction(nameof(GetNotification), new { id = newNotification.id }, newNotification);
        }

        private async Task PushNotification(String? title, String message, String? img_url)
        {
            var client = new RestClient("https://api.onesignal.com/notifications");
            var request = new RestRequest();
            request.AddHeader("Authorization", $"Basic {_configuration["ONESIGNAL:REST_API_KEY"]}");
            request.AddHeader("accept", "application/json");
            request.AddHeader("Content-Type", "application/json; charset=utf-8");

            var body = new
            {
                app_id = $"{_configuration["ONESIGNAL:APP_ID"]}",
                target_channel = "push",
                headings = !string.IsNullOrEmpty(title) ? new { en = title } : new { en = "" },
                contents =  new { en = message },
                included_segments = new[] { "Total Subscriptions" },
                big_picture = !string.IsNullOrEmpty(img_url) ? img_url : null,
            };

            request.AddJsonBody(body);
            Console.WriteLine(body);

            var reponse = await client.PostAsync(request);
            Console.WriteLine(reponse);
        }

        private async Task SendNotificationToTele(String? title, String message, String? img_url)
        {
            var client = new RestClient($"https://api.telegram.org/bot{_configuration["BOT_TELE:TOKEN"]}/sendMessage");
            var request = new RestRequest();
            request.AddHeader("Content-Type", "application/json; charset=utf-8");

            var body = new
            {
                chat_id = $"{_configuration["BOT_TELE:CHAT_ID"]}",
                text = (!string.IsNullOrEmpty(title) ? $"Tiêu đề: {title}\n" : "") +
                       $"Nội dung: {message}\n" +
                       (!string.IsNullOrEmpty(img_url) ? $"Ảnh: {img_url}" : ""),
            };
            request.AddJsonBody(body);

            await client.PostAsync(request);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                return NotFound();
            }
            return Ok(notification);
        }

        [HttpGet("notificationByTitleStatus/")]
        public async Task<IActionResult> GetNotisByTitleStatus(string? title, byte? status = null, int page = 1, int pageSize = 10)
        {
            var query = _context.Notifications.AsQueryable();

            if (title != "" && title != null)
            {
                query = query.Where(n => n.title!.Contains(title));
            }

            if (status.HasValue)
            {
                query = query.Where(n => n.status == status.Value);
            }

            var Notis = await query
                .OrderByDescending(n => n.update_at)
                .Select(n => new Notification
                {
                    id = n.id,
                    admin_id = n.admin_id,
                    title = n.title,
                    message = n.message,
                    img_url = n.img_url,
                    send_at = n.send_at,
                    update_at = n.update_at,
                    status = n.status,
                })
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalNotis = await query.CountAsync();

            var result = new
            {
                TotalNotis = totalNotis,
                Items = Notis
            };

            return Ok(result);
        }

        [HttpPut("updateStatus/{id}")]
        public async Task<IActionResult> UpdateStatus(uint id, byte status = 0)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) {
                return BadRequest();
            }

            notification.status = status;
            notification.update_at = DateTime.Now;
            Console.WriteLine(DateTime.Now);

            await _context.SaveChangesAsync();

            if (notification.status == 1) {
                await PushNotification(notification.title, notification.message, notification.img_url);
            }

            return Ok(notification);
        }
    }
}
