import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, JobTriggerResponse } from '../../services/job.service';

interface Toast { type: 'success' | 'error'; message: string; }

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>⚡ Birthday Job</h1>
        <p>Manually trigger the birthday email job or let it run on its daily schedule</p>
      </div>

      <!-- Info Banner -->
      <div class="info-banner">
        <span>🔧</span>
        <div>
          <strong>Hangfire is running!</strong>
          Monitor job execution at
          <a href="/hangfire" target="_blank" style="color:#6c63ff;font-weight:600;">
            localhost:5000/hangfire ↗
          </a>
        </div>
      </div>

      <!-- Single job card -->
      <div style="max-width: 420px;">
        <div class="job-card" style="border-top: 4px solid #f59e0b;">
          <span class="job-icon">🎂</span>
          <div class="job-name">Birthday Mail Job</div>

          <div class="job-schedule">
            <span>🕐</span> Daily at 9:00 AM &nbsp;|&nbsp; cron: <code>0 9 * * *</code>
          </div>

          <p class="job-desc">
            Queries all active employees whose birthday is today and sends each of them
            a warm, personalised HTML birthday greeting email via Gmail SMTP.
          </p>

          <div class="job-last-run" *ngIf="lastTriggered">
            <div>⏱️ Last triggered: <strong>{{ lastTriggered }}</strong></div>
            <div style="margin-top:4px;font-family:monospace;font-size:.75rem;color:var(--primary);">
              Job ID: {{ lastJobId }}
            </div>
          </div>

          <div class="job-last-run" *ngIf="!lastTriggered" style="color:var(--text-muted);">
            <span>⏳ Not manually triggered yet this session</span>
          </div>

          <button class="btn btn-primary" style="width:100%;" (click)="trigger()" [disabled]="loading">
            <span *ngIf="loading" class="spinner"></span>
            <span *ngIf="!loading">▶ Trigger Now</span>
            <span *ngIf="loading">Triggering…</span>
          </button>
        </div>
      </div>

      <!-- How it works -->
      <div class="card" style="margin-top: 28px; max-width: 600px;">
        <div class="card-header">
          <span class="card-title">📖 How It Works</span>
        </div>
        <div class="how-it-works">
          <div class="step">
            <div class="step-num">1</div>
            <div>
              <strong>Trigger Now</strong>
              <p>Click the button to enqueue the job immediately via <code>BackgroundJob.Enqueue()</code></p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div>
              <strong>Job Executes</strong>
              <p>Hangfire picks up the job from SQL Server and runs it in a background worker thread</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div>
              <strong>Emails Sent</strong>
              <p>MailKit sends HTML birthday emails via Gmail SMTP (port 587) to matching employees</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <div>
              <strong>Monitor Results</strong>
              <p>Check Hangfire Dashboard to see Succeeded / Failed status and execution details</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toasts -->
    <div class="toast-container">
      <div *ngFor="let t of toasts" class="toast" [ngClass]="'toast-' + t.type">
        <span>{{ t.type === 'success' ? '✅' : '❌' }}</span>
        {{ t.message }}
      </div>
    </div>
  `,
  styles: [`
    .info-banner {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 18px; background: #eff6ff; border: 1px solid #bfdbfe;
      border-radius: 10px; margin-bottom: 24px; font-size: .9rem; color: #1e40af;
    }
    .info-banner span { font-size: 1.3rem; }

    .job-card .job-schedule code {
      background: rgba(108,99,255,.12); padding: 1px 6px; border-radius: 4px; font-size: .8rem;
    }

    .how-it-works { display: flex; flex-direction: column; gap: 14px; }
    .step { display: flex; gap: 16px; align-items: flex-start; }
    .step-num {
      width: 30px; height: 30px; background: var(--primary); color: white;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: .85rem; flex-shrink: 0;
    }
    .step strong { display: block; margin-bottom: 2px; }
    .step p { font-size: .85rem; color: var(--text-muted); margin: 0; }
    .step code { background: var(--bg); padding: 1px 6px; border-radius: 4px; font-size: .82rem; }
  `]
})
export class JobsComponent {
  loading = false;
  lastTriggered: string | null = null;
  lastJobId: string | null = null;
  toasts: Toast[] = [];

  constructor(private jobService: JobService) {}

  trigger(): void {
    this.loading = true;
    this.jobService.triggerBirthday().subscribe({
      next: (res: JobTriggerResponse) => {
        this.loading = false;
        this.lastTriggered = new Date(res.triggeredAt).toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        this.lastJobId = res.jobId;
        this.showToast('success', `Birthday job triggered! Job ID: ${res.jobId}`);
      },
      error: () => {
        this.loading = false;
        this.showToast('error', 'Failed to trigger job. Is the API running?');
      }
    });
  }

  showToast(type: Toast['type'], message: string): void {
    const toast: Toast = { type, message };
    this.toasts.push(toast);
    setTimeout(() => this.toasts.splice(this.toasts.indexOf(toast), 1), 5000);
  }
}
