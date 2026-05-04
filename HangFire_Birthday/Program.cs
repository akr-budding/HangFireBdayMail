using Hangfire;
using Hangfire.PostgreSql;
using HangFire_Birthday.Config;
using HangFire_Birthday.Data;
using HangFire_Birthday.Jobs;
using HangFire_Birthday.Models;
using HangFire_Birthday.Services;
using Microsoft.EntityFrameworkCore;

// Npgsql v6+ requires UTC DateTimes — this switch enables legacy unspecified behaviour
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// ── Connection string ─────────────────────────────────────────────────────────
// Render gives DATABASE_URL as  postgresql://user:pass@host:port/db
// Npgsql EF Core needs ADO.NET format: Host=...;Port=...;Database=...
// This helper converts both transparently.
var rawConn = builder.Configuration.GetConnectionString("DefaultConnection")!;
var connectionString = ToNpgsqlConnectionString(rawConn);

// EF Core — PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Email settings
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();

// Hangfire job
builder.Services.AddScoped<BirthdayMailJob>();

// Hangfire — PostgreSQL storage
builder.Services.AddHangfire(config =>
    config
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(c => c.UseNpgsqlConnection(connectionString)));

builder.Services.AddHangfireServer();

// CORS — kept for local Angular dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-migrate on startup — retry loop handles Render cold-start DB delay
using (var scope = app.Services.CreateScope())
{
    var db     = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();
    var retries = 0;
    while (true)
    {
        try
        {
            db.Database.Migrate();
            logger.LogInformation("Database migration applied successfully.");
            break;
        }
        catch (Exception ex) when (retries < 5)
        {
            retries++;
            logger.LogWarning("Migration attempt {Retry} failed: {Message}. Retrying in 3s…", retries, ex.Message);
            Thread.Sleep(3000);
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");

// Hangfire dashboard — must be registered BEFORE static files so the Angular
// catch-all (MapFallbackToFile) cannot intercept the /hangfire route.
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangFire_Birthday.Config.AllowAllDashboardFilter() }
});

// Serve Angular from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();
app.MapControllers();

// Angular client-side routing fallback
app.MapFallbackToFile("index.html");

HangfireConfig.RegisterRecurringJobs();

// Render injects PORT at runtime
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Run($"http://0.0.0.0:{port}");


// ── Helper: convert postgresql:// URL → ADO.NET connection string ─────────────
static string ToNpgsqlConnectionString(string input)
{
    if (string.IsNullOrWhiteSpace(input)) return input;

    // Already ADO.NET format — pass through
    if (!input.StartsWith("postgres://") && !input.StartsWith("postgresql://"))
        return input;

    // Parse URI  e.g. postgresql://user:pass@host:5432/dbname?sslmode=require
    var uri = new Uri(input);

    var host     = uri.Host;
    var port     = uri.Port > 0 ? uri.Port : 5432;
    var database = uri.AbsolutePath.TrimStart('/');
    var userInfo = uri.UserInfo.Split(':', 2);
    var username = Uri.UnescapeDataString(userInfo[0]);
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;

    return $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Prefer;Trust Server Certificate=true";
}
