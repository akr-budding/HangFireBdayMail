using HangFire_Birthday.Data;
using HangFire_Birthday.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HangFire_Birthday.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(AppDbContext db, ILogger<EmployeeController> logger)
        {
            _db = db;
            _logger = logger;
        }

        // GET /api/employees
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _db.Employees
                .OrderBy(e => e.Name)
                .ToListAsync();
            return Ok(employees);
        }

        // GET /api/employees/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var employee = await _db.Employees.FindAsync(id);
            if (employee == null)
                return NotFound(new { message = $"Employee with id {id} not found." });
            return Ok(employee);
        }

        // POST /api/employees
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            employee.Id = 0;
            _db.Employees.Add(employee);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Created employee: {Name}", employee.Name);
            return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
        }

        // PUT /api/employees/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Employee updated)
        {
            var employee = await _db.Employees.FindAsync(id);
            if (employee == null)
                return NotFound(new { message = $"Employee with id {id} not found." });

            employee.Name = updated.Name;
            employee.Email = updated.Email;
            employee.Department = updated.Department;
            employee.DateOfBirth = updated.DateOfBirth;
            employee.JoiningDate = updated.JoiningDate;
            employee.IsActive = updated.IsActive;

            await _db.SaveChangesAsync();
            _logger.LogInformation("Updated employee: {Name}", employee.Name);
            return Ok(employee);
        }

        // DELETE /api/employees/{id} — soft delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var employee = await _db.Employees.FindAsync(id);
            if (employee == null)
                return NotFound(new { message = $"Employee with id {id} not found." });

            employee.IsActive = false;
            await _db.SaveChangesAsync();

            _logger.LogInformation("Soft-deleted employee: {Name}", employee.Name);
            return Ok(new { message = $"{employee.Name} has been deactivated." });
        }

        // GET /api/employees/stats — for dashboard
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var today = DateTime.Today;
            var total = await _db.Employees.CountAsync(e => e.IsActive);
            var birthdaysToday = await _db.Employees.CountAsync(e =>
                e.IsActive &&
                e.DateOfBirth.Day == today.Day &&
                e.DateOfBirth.Month == today.Month);
            var anniversariesToday = await _db.Employees.CountAsync(e =>
                e.IsActive &&
                e.JoiningDate.Day == today.Day &&
                e.JoiningDate.Month == today.Month &&
                e.JoiningDate.Year != today.Year);

            return Ok(new
            {
                totalEmployees = total,
                birthdaysToday,
                anniversariesToday
            });
        }
    }
}
