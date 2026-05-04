import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon">🎂</span>
          <div>
            <div class="brand-name">EmpBirthday</div>
            <div class="brand-sub">Employee Birthday Manager</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/employees" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span>
            <span>Employees</span>
          </a>
          <a routerLink="/jobs" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">⚡</span>
            <span>Birthday Job</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a href="http://localhost:5000/hangfire" target="_blank" class="hangfire-link">
            <span>🔧</span>
            <span>Hangfire Dashboard</span>
            <span class="ext-icon">↗</span>
          </a>
        </div>
      </aside>

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; min-height: 100vh; }

    .sidebar {
      width: 240px;
      min-height: 100vh;
      background: #1e1b4b;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,.1);
    }

    .brand-icon { font-size: 2rem; }
    .brand-name { font-size: 1.1rem; font-weight: 700; color: #fff; }
    .brand-sub  { font-size: 0.72rem; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .05em; }

    .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: 10px;
      color: rgba(255,255,255,.65);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.15s;
    }
    .nav-item:hover { background: rgba(255,255,255,.08); color: #fff; }
    .nav-item.active { background: #6c63ff; color: #fff; box-shadow: 0 4px 12px rgba(108,99,255,.4); }
    .nav-icon { font-size: 1.1rem; width: 22px; text-align: center; }

    .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,.1); }

    .hangfire-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 10px;
      color: rgba(255,255,255,.55);
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 500;
      transition: all 0.15s;
      border: 1px solid rgba(255,255,255,.12);
    }
    .hangfire-link:hover { background: rgba(255,255,255,.08); color: #fff; border-color: rgba(255,255,255,.25); }
    .ext-icon { margin-left: auto; font-size: .75rem; }

    .main-content { flex: 1; overflow: auto; background: #f4f6fb; }
  `]
})
export class AppComponent {}
