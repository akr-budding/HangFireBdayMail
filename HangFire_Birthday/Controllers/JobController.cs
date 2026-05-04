using Hangfire;
using HangFire_Birthday.Jobs;
using Microsoft.AspNetCore.Mvc;

namespace HangFire_Birthday.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class JobController : ControllerBase
    {
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly ILogger<JobController> _logger;

        public JobController(IBackgroundJobClient backgroundJobClient, ILogger<JobController> logger)
        {
            _backgroundJobClient = backgroundJobClient;
            _logger = logger;
        }

        // POST /api/jobs/trigger/birthday
        [HttpPost("trigger/birthday")]
        public IActionResult TriggerBirthday()
        {
            var jobId = _backgroundJobClient.Enqueue<BirthdayMailJob>(job => job.ExecuteAsync());
            _logger.LogInformation("Manually triggered BirthdayMailJob — JobId: {JobId}", jobId);
            return Ok(new
            {
                message = "Birthday mail job triggered successfully!",
                jobId,
                triggeredAt = DateTime.Now
            });
        }
    }
}
