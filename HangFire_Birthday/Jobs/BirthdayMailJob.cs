using HangFire_Birthday.Data;
using HangFire_Birthday.Services;
using Microsoft.EntityFrameworkCore;

namespace HangFire_Birthday.Jobs
{
    public class BirthdayMailJob
    {
        private readonly AppDbContext _db;
        private readonly IEmailService _emailService;
        private readonly ILogger<BirthdayMailJob> _logger;

        public BirthdayMailJob(AppDbContext db, IEmailService emailService, ILogger<BirthdayMailJob> logger)
        {
            _db = db;
            _emailService = emailService;
            _logger = logger;
        }

        // Triggered daily at 9 AM via cron: "0 9 * * *"
        public async Task ExecuteAsync()
        {
            var today = DateTime.Today;
            _logger.LogInformation("BirthdayMailJob running for {Date}", today.ToShortDateString());

            var birthdayEmployees = await _db.Employees
                .Where(e => e.IsActive &&
                            e.DateOfBirth.Day == today.Day &&
                            e.DateOfBirth.Month == today.Month)
                .ToListAsync();

            if (!birthdayEmployees.Any())
            {
                _logger.LogInformation("No birthdays today.");
                return;
            }

            foreach (var emp in birthdayEmployees)
            {
                var subject = $"🎂 Happy Birthday, {emp.Name}!";
                var body = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px;'>
                        <div style='text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px;'>
                            <h1 style='color: white; font-size: 2.5em; margin: 0;'>🎂 Happy Birthday! 🎉</h1>
                        </div>
                        <div style='padding: 30px 0; text-align: center;'>
                            <h2 style='color: #333; font-size: 1.8em;'>Dear {emp.Name},</h2>
                            <p style='color: #555; font-size: 1.1em; line-height: 1.8;'>
                                Wishing you a truly wonderful birthday filled with joy, laughter, and everything you deserve! 🌟
                            </p>
                            <p style='color: #555; font-size: 1.1em; line-height: 1.8;'>
                                The entire <strong>EmpBirthday</strong> team celebrates this special day with you.
                                May this year bring you amazing opportunities and happiness!
                            </p>
                            <div style='background: #f9f0ff; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                                <p style='color: #764ba2; font-size: 1.2em; font-weight: bold; margin: 0;'>
                                    🎈 Have a spectacular day, {emp.Name}! 🎈
                                </p>
                            </div>
                        </div>
                        <div style='border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #999; font-size: 0.9em;'>
                            <p>Sent with ❤️ by EmpBirthday | {emp.Department} Team</p>
                        </div>
                    </div>";

                await _emailService.SendAsync(emp.Email, emp.Name, subject, body);
                _logger.LogInformation("Birthday email sent to {Name} ({Email})", emp.Name, emp.Email);
            }
        }
    }
}
