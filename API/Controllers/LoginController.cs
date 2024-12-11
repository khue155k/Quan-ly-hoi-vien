using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly JwtService _jwtService;
    private readonly AppDbContext _context;

    public LoginController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDTO loginUser)
    {
        var passEncode = GenerateSHA256(loginUser.password);

        var user = (from u in _context.Users
                    where u.email == loginUser.email && u.password == passEncode
                    select u).FirstOrDefault();

        if (user == null)
        {
            return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            token = token
        });
    }

    //[HttpPost("create")]
    //public async Task<IActionResult> ChangePassword([FromBody] LoginDTO request)
    //{
    //    var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);

    //    if (user != null)
    //    {
    //        return NotFound(new { message = "Tên người dùng đã tồn tại" });
    //    }

    //    var passEncode = GenerateSHA256(request.password);
    //    user.password = passEncode;

    //    _context.Users.Add(user);
    //    await _context.SaveChangesAsync();

    //    return Ok(new
    //    {
    //        message = "Tạo tài khoản thành công!",
    //    });
    //}

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);

        if (user == null)
        {
            return NotFound(new { message = "Không tồn tại tên người dùng" });
        }

        var oldPassEncode = GenerateSHA256(request.oldPassword);
        if (user.password != oldPassEncode)
        {
            return Unauthorized(new { message = "Mật khẩu cũ không chính xác" });
        }

        var newPassEncode = GenerateSHA256(request.newPassword);
        user.password = newPassEncode;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Đổi mật khẩu thành công!",
        });
    }

    [HttpPost("refresh-token")]
    public IActionResult RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (string.IsNullOrEmpty(request.RefreshToken))
        {
            return Unauthorized("Refresh token is required");
        }

        var principal = _jwtService.GetPrincipalFromExpiredToken(request.RefreshToken);
        if (principal == null)
        {
            return Unauthorized("Invalid refresh token");
        }

        var userId = principal.Identity?.Name;
        if (userId == null)
        {
            return Unauthorized("Invalid refresh token");
        }

        var user = new User
        {
            //company_id = Convert.ToUInt32(userId),  
            company_id = Convert.ToUInt32(principal.FindFirst(ClaimTypes.NameIdentifier)?.Value),
            email = principal.FindFirst(ClaimTypes.Email)?.Value,
            admin = principal.FindFirst(ClaimTypes.Role)?.Value == "Admin" ? "yes" : "no",
            name = principal.FindFirst(ClaimTypes.GivenName)?.Value
        };

        var newAccessToken = _jwtService.GenerateToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken(); // Tạo refresh token mới

        return Ok(new { AccessToken = newAccessToken, RefreshToken = newRefreshToken });
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; }
    }

    private static Random _random = new Random();
    public static string GeneratePassword(int length = 12)
    {
        const string validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/";
        var password = new string(
            Enumerable.Range(0, length)
                      .Select(_ => validChars[_random.Next(validChars.Length)])
                      .ToArray());

        return password;
    }

    public static string GenerateSHA256(string input)
    {
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] bytes = Encoding.UTF8.GetBytes(input);
            byte[] hashBytes = sha256.ComputeHash(bytes);

            StringBuilder builder = new StringBuilder();
            foreach (byte b in hashBytes)
            {
                builder.Append(b.ToString("x2"));
            }

            return builder.ToString();
        }
    }
}
