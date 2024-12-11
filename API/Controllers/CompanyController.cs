using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using RestSharp;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public CompanyController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet("company-list")]
    public async Task<IActionResult> GetCompanyList(int page = 1, int pageSize = 10)
    {
        var CompanyList = await _context.Companies
            .OrderByDescending(c => c.id)
            .Select(c => new CompanyDTO
            {
                id = c.id,
                ten_doanh_nghiep = c.ten_doanh_nghiep,
                mst = c.mst ?? "",
                diachi = c.diachi ?? "",
                status = c.status
            })
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalCompanies = _context.Companies.Count();

        var result = new
        {
            TotalCompanies = totalCompanies,
            Page = page,
            PageSize = pageSize,
            Items = CompanyList
        };

        return Ok(result);
    }

    [HttpGet("company-list-by-status")]
    public async Task<IActionResult> GetCompanyListByStatus(byte status, int page = 1, int pageSize = 10)
    {
        var CompanyList = await _context.Companies
            .Where(c => c.status == status)
            .OrderByDescending(c => c.id)
            .Select(c => new CompanyDTO
            {
                id = c.id,
                ten_doanh_nghiep = c.ten_doanh_nghiep,
                mst = c.mst ?? "",
                diachi = c.diachi ?? "",
                status = c.status
            })
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalCompanies = _context.Companies.Count(c => c.status == status);

        var result = new
        {
            TotalCompanies = totalCompanies,
            Page = page,
            PageSize = pageSize,
            Items = CompanyList
        };

        return Ok(result);
    }

    [HttpGet("company-list-by-name-status")]
    public async Task<IActionResult> GetCompanyListByNameStatus(string? name, byte? status = null, int page = 1, int pageSize = 10)
    {

        var query = _context.Companies.AsQueryable();

        if (name != "" && name != null)
        {
            query = query.Where(c => c.ten_doanh_nghiep.Contains(name));
        }

        if (status.HasValue && status != (byte)4)
        {
            query = query.Where(c => c.status == status.Value);
        }

        var CompanyList = await query
            .OrderByDescending(c => c.id)
            .Select(c => new CompanyDTO
            {
                id = c.id,
                ten_doanh_nghiep = c.ten_doanh_nghiep,
                mst = c.mst,
                diachi = c.diachi,
                status = c.status
            })
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalCompanies = query.Count();

        var result = new
        {
            TotalCompanies = totalCompanies,
            Page = page,
            PageSize = pageSize,
            Items = CompanyList
        };

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCompanyDetail(uint id)
    {
        var company = await _context.Companies.FindAsync(id);
        // .Where(c => c.id == id)
        // .Select(c => new Company{
        //     id = c.id,
        //     ten_doanh_nghiep = c.ten_doanh_nghiep,
        //     mst = c.mst,
        //     diachi = c.diachi,
        //     status = c.status
        // })
        // .FirstOrDefaultAsync();

        if (company == null)
        {
            return NotFound(new { Message = "Company not found." });
        }
        return Ok(company);
    }

    [HttpPut("update-status/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateCompanyStatus(uint id, [FromBody] byte status)
    {
        var company = await _context.Companies.FindAsync(id);

        if (company == null)
        {
            return NotFound(new { message = "Không tìm thấy doanh nghiệp!" });
        }

        company.status = status;
        company.updated_at = DateTime.Now;

        _context.SaveChanges();

        return Ok(new { message = "Trạng thái doanh nghiệp đã được cập nhật" });
    }

    [HttpPost("create")]
    public async Task<ActionResult> CreateCompany([FromBody] Company company)
    {
        bool mstExists = _context.Companies.Any(c => c.mst == company.mst);
        bool emailExists = _context.Companies.Any(c => c.email == company.email);

        if (mstExists)
        {
            return Conflict(new { Message = "Mã số thuế đã tồn tại." });
        }
        if (emailExists)
        {
            return Conflict(new { Message = "Email đã tồn tại." });
        }

        var invalidFields = new List<KeyValuePair<string, string>>()
        {
            new KeyValuePair<string, string>( company.ten_doanh_nghiep, "Tên doanh nghiệp không hợp lệ." ),
            new KeyValuePair<string, string>( company.mst, "Mã số thuế không hợp lệ." ),
            new KeyValuePair<string, string>( company.diachi, "Địa chỉ không hợp lệ." ),
            new KeyValuePair<string, string>( company.so_dt, "Số điện thoại doanh nghiệp không hợp lệ." ),
            new KeyValuePair<string, string>( company.zalo, "Zalo doanh nghiệp không hợp lệ." ),
            new KeyValuePair<string, string>( company.email, "Email doanh nghiệp không hợp lệ." ),
            new KeyValuePair<string, string>( company.hoten_ndd, "Tên người đại diện không hợp lệ." ),
            new KeyValuePair<string, string>( company.so_dt_ndd, "Số điện thoại người đại diện không hợp lệ." ),
            new KeyValuePair<string, string>( company.email_ndd, "Email người đại diện không hợp lệ." ),
            new KeyValuePair<string, string>( company.hoten_nlh, "Họ tên người liên hệ không hợp lệ." ),
            new KeyValuePair<string, string>( company.so_dt_nlh, "Số điện thoại người liên hệ không hợp lệ." ),
            new KeyValuePair<string, string>( company.email_nlh, "Email người liên hệ không hợp lệ." )
        };

        foreach (var field in invalidFields)
        {
            if (string.IsNullOrEmpty(field.Key))
            {
                return BadRequest(new { Message = field.Value });
            }
        }
        var invalidFieldsEmail = new List<KeyValuePair<string, string>>()
        {
            new KeyValuePair<string, string>( company.email, "Email doanh nghiệp không hợp lệ." ),
            new KeyValuePair<string, string>( company.email_ndd, "Email người đại diện không hợp lệ." ),
            new KeyValuePair<string, string>( company.email_nlh, "Email người liên hệ không hợp lệ." )
        };
        foreach (var field in invalidFieldsEmail)
        {
            if (!IsValidEmail(field.Key))
            {
                return BadRequest(new { Message = field.Value });
            }
        }
        company.status = (byte)1;
        company.dongy = (byte)0;
        company.created_at = DateTime.Now;
        company.updated_at = DateTime.Now;

        _context.Companies.Add(company);

        String password = LoginController.GeneratePassword(8);
        var encodePass = LoginController.GenerateSHA256(password);
        User user = new User
        {
            name = company.ten_doanh_nghiep,
            company_id = company.id,
            email = company.email,
            password = encodePass,
            admin = "no"
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        await SendNotificationToTele("Có hội viên mới", $"Hội viên {company.ten_doanh_nghiep} vừa mới đăng ký", "");

        return StatusCode(201, new { Message = $"Bạn đã đăng kí thành công:\nTài khoản của bạn: {company.email}\nMật khẩu: {password}" });
    }

    private bool IsValidEmail(string email)
    {
        var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        return Regex.IsMatch(email, emailPattern);
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
}
