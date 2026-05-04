import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeStats } from '../../models/employee.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📊 Dashboard</h1>
        <p>Employee birthday overview for today</p>
      </div>

      <!-- Stats -->
      <div class="stats-grid" *ngIf="!loading; else loadingTpl">
        <div class="stat-card" style="border-top: 4px solid #6c63ff;">
          <span class="stat-icon">👥</span>
          <div class="stat-value">{{ stats?.totalEmployees ?? 0 }}</div>
          <div class="stat-label">Active Employees</div>
        </div>

        <div class="stat-card" style="border-top: 4px solid #f59e0b;">
          <span class="stat-icon">🎂</span>
          <div class="stat-value">{{ stats?.birthdaysToday ?? 0 }}</div>
          <div class="stat-label">Birthdays Today</div>
        </div>

        <div class="stat-card" style="border-top: 4px solid #22c55e;">
          <span class="stat-icon">⚡</span>
          <div class="stat-value">1</div>
          <div class="stat-label">Active Scheduled Job</div>
        </div>
      </div>

      <ng-template #loadingTpl>
        <div class="loading-grid">
          <div class="skeleton-card" *ngFor="let i of [1,2,3]"></div>
        </div>
      </ng-template>

      <div class="dashboard-grid">
        <!-- Today's Birthdays -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">🎂 Today's Birthdays</span>
            <span class="badge badge-info">{{ today }}</span>
          </div>

          <div *ngIf="stats?.birthdaysToday; else noEvents">
            <div class="event-item birthday">
              <span class="event-icon">🎂</span>
              <div>
                <strong>{{ stats?.birthdaysToday }} Birthday{{ stats?.birthdaysToday! > 1 ? 's' : '' }} Today</strong>
                <p>Birthday email job runs automatically at 9 AM</p>
              </div>
            </div>
          </div>

          <ng-template #noEvents>
            <div class="empty-state" style="padding: 30px;">
              <span class="empty-icon">📭</span>
              <p>No birthdays today</p>
            </div>
          </ng-template>
        </div>

        <!-- Job Schedule -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">⏰ Job Schedule</span>
          </div>
          <div class="schedule-list">
            <div class="schedule-item">
              <span class="schedule-icon">🎂</span>
              <div class="schedule-info">
                <strong>Birthday Mail Job</strong>
                <span class="schedule-time">Daily at 9:00 AM — cron: 0 9 * * *</span>
              </div>
              <span class="badge badge-success">Active</span>
            </div>
          </div>
        </div>

        <!-- Hangfire -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">🔧 Hangfire Dashboard</span>
          </div>
          <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:16px;">
            Monitor birthday job execution, view history, and retry failed jobs in real-time.
          </p>
          <div class="hangfire-url">
            <code>http://localhost:5000/hangfire</code>  <!-- or just /hangfire when published -->
          </div>
          <a href="/hangfire" target="_blank" class="btn btn-primary" style="margin-top:16px;">
            Open Hangfire Dashboard ↗
          </a>
        </div>

        <!-- Quick links -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">🚀 Quick Actions</span>
          </div>
          <div class="quick-actions">
            <a routerLink="/employees" class="quick-action-item">
              <span>👥</span>
              <div>
                <strong>Manage Employees</strong>
                <p>Add, edit, or deactivate employees</p>
              </div>
              <span class="arrow">→</span>
            </a>
            <a routerLink="/jobs" class="quick-action-item">
              <span>⚡</span>
              <div>
                <strong>Trigger Birthday Job</strong>
                <p>Manually send birthday emails now</p>
              </div>
              <span class="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
    }
    .skeleton-card {
      height: 120px;
      background: linear-gradient(90deg, #e2e8f0 25%, #f0f4f8 50%, #e2e8f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 16px;
    }
    @keyframes shimmer { to { background-position: -200% 0 } }

    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 22px; }

    .event-item {
      display: flex; align-items: center; gap: 14px;
      padding: 14px; border-radius: 10px; margin-bottom: 10px;
    }
    .event-item.birthday { background: #fef9c3; }
    .event-item p { font-size: .82rem; color: var(--text-muted); margin-top: 2px; }
    .event-icon { font-size: 1.8rem; }

    .schedule-list { display: flex; flex-direction: column; gap: 10px; }
    .schedule-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg); border-radius: 8px; }
    .schedule-icon { font-size: 1.3rem; }
    .schedule-info { flex: 1; }
    .schedule-info strong { font-size: .88rem; display: block; }
    .schedule-time { font-size: .78rem; color: var(--text-muted); font-family: monospace; }

    .hangfire-url { background: #1e1b4b; padding: 12px 16px; border-radius: 8px; }
    .hangfire-url code { color: #a5b4fc; font-size: .9rem; }

    .quick-actions { display: flex; flex-direction: column; gap: 10px; }
    .quick-action-item {
      display: flex; align-items: center; gap: 14px; padding: 14px;
      border-radius: 10px; border: 1.5px solid var(--border);
      text-decoration: none; color: var(--text); transition: all 0.15s; font-size: 1.3rem;
    }
    .quick-action-item:hover { border-color: var(--primary); background: var(--primary-light); }
    .quick-action-item > div { flex: 1; }
    .quick-action-item strong { display: block; font-size: .9rem; }
    .quick-action-item p { font-size: .8rem; color: var(--text-muted); margin-top: 2px; }
    .arrow { color: var(--primary); font-size: 1.2rem; font-weight: 700; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: EmployeeStats | null = null;
  loading = true;
  today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getStats().subscribe({
      next: (s) => { this.stats = s; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
