import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeForm } from '../../models/employee.model';

interface Toast { type: 'success' | 'error' | 'info'; message: string; }

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div>
          <h1>👥 Employees</h1>
          <p>Manage your team members and their details</p>
        </div>
        <button class="btn btn-primary" (click)="openAdd()">
          <span>＋</span> Add Employee
        </button>
      </div>

      <!-- Table Card -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Team Members</span>
          <span class="badge badge-info">{{ employees.length }} total</span>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" style="text-align:center; padding:40px;">
          <div class="spinner" style="width:32px;height:32px;border-width:3px;border-color:rgba(108,99,255,.2);border-top-color:#6c63ff;margin:0 auto;"></div>
          <p style="margin-top:12px;color:var(--text-muted);">Loading employees…</p>
        </div>

        <!-- Empty -->
        <div *ngIf="!loading && employees.length === 0" class="empty-state">
          <span class="empty-icon">👤</span>
          <p>No employees found. Add your first team member!</p>
        </div>

        <!-- Table -->
        <div class="table-wrapper" *ngIf="!loading && employees.length > 0">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Date of Birth</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of employees; let i = index">
                <td style="color:var(--text-muted);font-size:.8rem;">{{ i + 1 }}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div class="avatar">{{ initials(emp.name) }}</div>
                    <strong>{{ emp.name }}</strong>
                  </div>
                </td>
                <td style="color:var(--text-muted);font-size:.88rem;">{{ emp.email }}</td>
                <td><span class="badge badge-info">{{ emp.department }}</span></td>
                <td>{{ formatDate(emp.dateOfBirth) }}</td>
                <td>{{ formatDate(emp.joiningDate) }}</td>
                <td>
                  <span class="badge" [ngClass]="emp.isActive ? 'badge-success' : 'badge-danger'">
                    {{ emp.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-outline btn-sm" (click)="openEdit(emp)" title="Edit">✏️</button>
                    <button class="btn btn-danger btn-sm" (click)="confirmDelete(emp)" title="Deactivate" [disabled]="!emp.isActive">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal($event)">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ editMode ? '✏️ Edit Employee' : '➕ Add Employee' }}</h2>
          <button class="modal-close" (click)="showModal = false">×</button>
        </div>

        <form (ngSubmit)="save()">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" [(ngModel)]="form.name" name="name" placeholder="Alice Johnson" required />
            </div>
            <div class="form-group">
              <label>Email Address *</label>
              <input type="email" [(ngModel)]="form.email" name="email" placeholder="alice@example.com" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Department *</label>
              <select [(ngModel)]="form.department" name="department" required>
                <option value="">— Select Department —</option>
                <option *ngFor="let d of departments">{{ d }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status</label>
              <div class="toggle-wrapper" style="margin-top:8px;">
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="form.isActive" name="isActive" />
                  <span class="slider"></span>
                </label>
                <span style="font-size:.9rem;">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date of Birth *</label>
              <input type="date" [(ngModel)]="form.dateOfBirth" name="dateOfBirth" required />
            </div>
            <div class="form-group">
              <label>Joining Date *</label>
              <input type="date" [(ngModel)]="form.joiningDate" name="joiningDate" required />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline" (click)="showModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              <span *ngIf="saving" class="spinner"></span>
              {{ saving ? 'Saving…' : (editMode ? 'Update Employee' : 'Add Employee') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="closeModal($event)">
      <div class="modal" style="max-width:440px;">
        <div class="modal-header">
          <h2 class="modal-title">🗑️ Deactivate Employee</h2>
          <button class="modal-close" (click)="showDeleteModal = false">×</button>
        </div>
        <p style="color:var(--text-muted);margin-bottom:8px;">
          Are you sure you want to deactivate
          <strong style="color:var(--text);">{{ selectedEmployee?.name }}</strong>?
        </p>
        <p style="color:var(--text-muted);font-size:.85rem;">
          This is a soft delete — the employee record is kept but marked as inactive.
        </p>
        <div class="modal-actions">
          <button class="btn btn-outline" (click)="showDeleteModal = false">Cancel</button>
          <button class="btn btn-danger" (click)="deleteEmployee()" [disabled]="saving">
            <span *ngIf="saving" class="spinner"></span>
            {{ saving ? 'Deactivating…' : 'Deactivate' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toasts -->
    <div class="toast-container">
      <div *ngFor="let t of toasts" class="toast" [ngClass]="'toast-' + t.type">
        <span>{{ t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️' }}</span>
        {{ t.message }}
      </div>
    </div>
  `,
  styles: [`
    .avatar {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: var(--primary-light);
      color: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-size: .78rem; font-weight: 700;
      flex-shrink: 0;
    }
  `]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  saving = false;
  showModal = false;
  showDeleteModal = false;
  editMode = false;
  selectedEmployee: Employee | null = null;
  toasts: Toast[] = [];

  departments = ['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'Design', 'Product', 'Legal'];

  form: EmployeeForm = this.emptyForm();

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void { this.loadEmployees(); }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAll().subscribe({
      next: (list) => { this.employees = list; this.loading = false; },
      error: () => { this.loading = false; this.showToast('error', 'Failed to load employees. Is the API running?'); }
    });
  }

  openAdd(): void {
    this.editMode = false;
    this.form = this.emptyForm();
    this.showModal = true;
  }

  openEdit(emp: Employee): void {
    this.editMode = true;
    this.selectedEmployee = emp;
    this.form = {
      name: emp.name,
      email: emp.email,
      department: emp.department,
      dateOfBirth: emp.dateOfBirth.substring(0, 10),
      joiningDate: emp.joiningDate.substring(0, 10),
      isActive: emp.isActive
    };
    this.showModal = true;
  }

  confirmDelete(emp: Employee): void {
    this.selectedEmployee = emp;
    this.showDeleteModal = true;
  }

  save(): void {
    this.saving = true;
    const payload = { ...this.form };

    const call = this.editMode && this.selectedEmployee
      ? this.employeeService.update(this.selectedEmployee.id, payload)
      : this.employeeService.create(payload);

    call.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.loadEmployees();
        this.showToast('success', `Employee ${this.editMode ? 'updated' : 'added'} successfully!`);
      },
      error: () => {
        this.saving = false;
        this.showToast('error', `Failed to ${this.editMode ? 'update' : 'add'} employee.`);
      }
    });
  }

  deleteEmployee(): void {
    if (!this.selectedEmployee) return;
    this.saving = true;
    this.employeeService.delete(this.selectedEmployee.id).subscribe({
      next: () => {
        this.saving = false;
        this.showDeleteModal = false;
        this.loadEmployees();
        this.showToast('success', `${this.selectedEmployee!.name} deactivated.`);
      },
      error: () => {
        this.saving = false;
        this.showToast('error', 'Failed to deactivate employee.');
      }
    });
  }

  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showModal = false;
      this.showDeleteModal = false;
    }
  }

  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
  }

  showToast(type: Toast['type'], message: string): void {
    const toast: Toast = { type, message };
    this.toasts.push(toast);
    setTimeout(() => this.toasts.splice(this.toasts.indexOf(toast), 1), 4000);
  }

  private emptyForm(): EmployeeForm {
    return { name: '', email: '', dateOfBirth: '', joiningDate: '', department: '', isActive: true };
  }
}
