# HangFire_Birthday — Run Instructions

## Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server Express (localhost\SQLEXPRESS)
- Gmail account with **App Password** enabled

---

## Step 1 — Configure Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Generate an App Password for "Mail"
3. Copy the 16-character password (no spaces)
4. Open `HangFire_Birthday/appsettings.json`
5. Replace:
   ```json
   "SenderEmail": "your@gmail.com",
   "SenderPassword": "your-16-char-app-password",
   "SenderName": "StaffPulse"
   ```
   Also update the employee seed emails in AppDbContext.cs to real emails you can check,
   OR just set SenderEmail as both sender and recipient for testing.

---

## Step 2 — Run the Backend API

```bash
cd A:\Hangfire-JOB\HangFire_Birthday\HangFire_Birthday

# Restore packages
dotnet restore

# Run — auto-migrates DB and creates Employees table + seed data
dotnet run
```

API starts at: http://localhost:5000
Swagger UI:    http://localhost:5000/swagger
Hangfire:      http://localhost:5000/hangfire

---

## Step 3 — Run the Angular Frontend

Open a NEW terminal:

```bash
cd A:\Hangfire-JOB\HangFire_Birthday\hangfire-birthday-ui

# Install dependencies
npm install

# Start dev server
npm start
```

Angular starts at: http://localhost:4200

---

## Step 4 — Test the System

### Test Birthday Email:
1. Open http://localhost:4200/jobs
2. Click **"Trigger Now"** on Birthday Mail Job
3. Watch the toast notification for the Job ID
4. Open http://localhost:5000/hangfire → Jobs → Succeeded
5. Check alice@example.com inbox — birthday email arrives within ~30 seconds

### Test Work Anniversary Email:
1. Click **"Trigger Now"** on Work Anniversary Job
2. Check bob@example.com inbox — anniversary email arrives

### Test Leave Reminder:
1. Click **"Trigger Now"** on Leave Reminder Job
2. All active employees (Alice, Bob, Carol, David) receive emails

### Test Payslip Reminder:
1. Click **"Trigger Now"** on Payslip Reminder Job
2. All active employees receive payslip notification

---

## If You Need Fresh Migrations

If you want to regenerate migrations from scratch:

```bash
cd A:\Hangfire-JOB\HangFire_Birthday\HangFire_Birthday

# Delete existing migrations folder
rm -rf Migrations/

# Add new migration
dotnet ef migrations add InitialCreate

# Apply migration (or let Program.cs auto-apply on startup)
dotnet ef database update
```

---

## Folder Structure

```
HangFire_Birthday/
├── HangFire_Birthday.sln
├── HangFire_Birthday/                  ← ASP.NET Core 8 API
│   ├── Controllers/
│   │   ├── EmployeeController.cs       ← CRUD API
│   │   └── JobController.cs           ← Manual job triggers
│   ├── Config/
│   │   └── HangfireConfig.cs          ← Recurring job registrations
│   ├── Data/
│   │   └── AppDbContext.cs            ← EF Core + seed data
│   ├── Jobs/
│   │   ├── BirthdayMailJob.cs
│   │   ├── WorkAnniversaryJob.cs
│   │   ├── LeaveReminderJob.cs
│   │   └── PayslipReminderJob.cs
│   ├── Migrations/                    ← EF Core migrations
│   ├── Models/
│   │   ├── Employee.cs
│   │   └── EmailSettings.cs
│   ├── Services/
│   │   └── EmailService.cs            ← MailKit SMTP
│   ├── Program.cs                     ← App bootstrap
│   ├── appsettings.json               ← ⚠️ Set your Gmail credentials here
│   └── HangFire_Birthday.csproj
│
└── hangfire-birthday-ui/               ← Angular 18 frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── dashboard/          ← Stats overview
    │   │   │   ├── employees/          ← CRUD table + modal
    │   │   │   └── jobs/              ← Job trigger panel
    │   │   ├── models/employee.model.ts
    │   │   ├── services/
    │   │   │   ├── employee.service.ts
    │   │   │   └── job.service.ts
    │   │   ├── app.component.ts        ← Shell + sidebar nav
    │   │   ├── app.config.ts
    │   │   └── app.routes.ts
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

---

## Recurring Job Schedules

| Job | Cron | Human Readable |
|-----|------|----------------|
| BirthdayMailJob | `0 9 * * *` | Every day at 9:00 AM |
| WorkAnniversaryJob | `0 9 * * *` | Every day at 9:00 AM |
| LeaveReminderJob | `0 10 * * 1` | Every Monday at 10:00 AM |
| PayslipReminderJob | `0 8 1 * *` | 1st of every month at 8:00 AM |

---

## Troubleshooting

**"Authentication failed" SMTP error:**
- Make sure you're using an **App Password**, NOT your Gmail login password
- 2-Factor Authentication must be enabled on the Gmail account

**"Cannot connect to SQL Server":**
- Ensure SQL Server Express is running: `services.msc` → SQL Server (SQLEXPRESS)
- Check the connection string in `appsettings.json`

**CORS error in Angular:**
- Ensure API is running on port 5000
- Check `launchSettings.json` or set `ASPNETCORE_URLS=http://localhost:5000`

**Hangfire dashboard shows "Failed" jobs:**
- Click the failed job → see the error details
- Most common: wrong email credentials or SQL connection issue
