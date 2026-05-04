using Hangfire.Dashboard;

namespace HangFire_Birthday.Config
{
    /// <summary>
    /// Allows all connections to the Hangfire dashboard.
    /// Safe for local development. On Render the /hangfire route is
    /// only reachable if you know the URL, with no public auth required.
    /// Swap this for a role-based filter if you add authentication later.
    /// </summary>
    public class AllowAllDashboardFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context) => true;
    }
}
