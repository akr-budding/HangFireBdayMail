using Hangfire;
using HangFire_Birthday.Jobs;

namespace HangFire_Birthday.Config
{
    public static class HangfireConfig
    {
        public static void RegisterRecurringJobs()
        {
            // Birthday emails — every day at 9 AM
            RecurringJob.AddOrUpdate<BirthdayMailJob>(
                "birthday-mail-job",
                job => job.ExecuteAsync(),
                "0 9 * * *",
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Local }
            );
        }
    }
}
