using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using Microsoft.AspNetCore.Authorization;
using API.Models;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeeController : ControllerBase
{
    private readonly AppDbContext _context;

    public FeeController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFee(int id)
    {
        var fee = await _context.Fees.FindAsync(id);
        if (fee == null)
        {
            return NotFound();
        }
        return Ok(fee);
    }


    [HttpGet]
    public async Task<IActionResult> GetFeeList()
    {
        var FeeList = await _context.Fees
            .OrderByDescending(c => c.year)
            .ToListAsync();

        var result = new
        {
            Items = FeeList
        };

        return Ok(result);
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> CreateFee([FromBody] Fee newFee)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Fees.Add(newFee);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFee), new { id = newFee.id }, newFee);
    }

    [HttpGet("list-fee-company/{companyId}")]
    public async Task<IActionResult> GetFeeListByCompany(uint companyId, int pageNumber = 1, int pageSize = 10)
    {
        var fees = await _context.Fees.ToListAsync();
        var membershipFees = await _context.MembershipFees.Where(mf => mf.company_id == companyId).ToListAsync();

        var TotalCount = fees.GroupJoin(
            membershipFees,
            f => f.id,
            mf => mf.fee_id,
            (f, feeGroup) => new { Fees = f, MembershipFees = feeGroup.DefaultIfEmpty() }
            ).SelectMany(
                fg => fg.MembershipFees,
                (fg, mf) => new
                {
                    Nam = fg.Fees.year,
                    HoiPhi = fg.Fees.fee_amount,
                    TrangThai = mf?.payment_date != null ? "Đã đóng" : "Chưa đóng",
                    HinhThucDong = mf?.payment_method,
                    NgayDong = mf?.payment_date
                }
            )
            .OrderByDescending(f => f.Nam)
            .ToList();

        var result = TotalCount.Skip((pageNumber - 1) * pageSize)
            .Take(pageSize);

        if (result == null || !result.Any())
        {
            return NotFound("Không tìm thấy thông tin hội phí cho công ty này.");
        }

        var response = new
        {
            TotalCount = TotalCount.Count(),
            Fees = result
        };

        return Ok(response);
    }
}
