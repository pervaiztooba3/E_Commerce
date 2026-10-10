import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="auth-page container">
      <div class="auth-card card">
        <!-- Auth Tabs Switcher -->
        <div class="auth-tabs">
          <button [class.active]="activeTab === 'login'" (click)="activeTab = 'login'">Sign In</button>
          <button [class.active]="activeTab === 'register'" (click)="activeTab = 'register'">Create Account</button>
        </div>

        <div class="auth-body">
          <!-- LOGIN FORM -->
          <div *ngIf="activeTab === 'login'" class="fade-in">
            <h2 class="auth-heading">Welcome Back</h2>
            <p class="auth-subtext">Access your account, track orders, and manage wishlist.</p>

            <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input
                  type="email"
                  formControlName="email"
                  class="form-control"
                  [class.is-invalid]="isLoginFieldInvalid('email')"
                  placeholder="user@shop.com"
                />
                <div class="error-text" *ngIf="isLoginFieldInvalid('email')">Valid email required.</div>
              </div>

              <div class="form-group">
                <div class="label-row">
                  <label class="form-label">Password</label>
                  <a href="javascript:void(0)" (click)="showForgotModal = true" class="forgot-link">Forgot Password?</a>
                </div>
                <input
                  type="password"
                  formControlName="password"
                  class="form-control"
                  [class.is-invalid]="isLoginFieldInvalid('password')"
                  placeholder="••••••••"
                />
                <div class="error-text" *ngIf="isLoginFieldInvalid('password')">Password required.</div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg btn-full mt-3">Sign In to Account</button>
            </form>

            <!-- Quick Demo Accounts Launcher -->
            <div class="demo-accounts-box mt-4">
              <span class="demo-title">⚡ Quick One-Click Demo Login:</span>
              <div class="demo-btn-group">
                <button type="button" class="btn btn-secondary btn-sm flex-1" (click)="fillCustomerDemo()">
                  Customer Demo (user&#64;shop.com)
                </button>
                <button type="button" class="btn btn-outline btn-sm flex-1" (click)="fillAdminDemo()">
                  Admin Demo (admin&#64;shop.com)
                </button>
              </div>
            </div>
          </div>

          <!-- REGISTER FORM -->
          <div *ngIf="activeTab === 'register'" class="fade-in">
            <h2 class="auth-heading">Join AURA STORE</h2>
            <p class="auth-subtext">Create a free customer account for fast checkout and rewards.</p>

            <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input
                  type="text"
                  formControlName="name"
                  class="form-control"
                  [class.is-invalid]="isRegisterFieldInvalid('name')"
                  placeholder="John Doe"
                />
                <div class="error-text" *ngIf="isRegisterFieldInvalid('name')">Name is required.</div>
              </div>

              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input
                  type="email"
                  formControlName="email"
                  class="form-control"
                  [class.is-invalid]="isRegisterFieldInvalid('email')"
                  placeholder="name@example.com"
                />
                <div class="error-text" *ngIf="isRegisterFieldInvalid('email')">Valid email required.</div>
              </div>

              <div class="form-group">
                <label class="form-label">Password</label>
                <input
                  type="password"
                  formControlName="password"
                  class="form-control"
                  [class.is-invalid]="isRegisterFieldInvalid('password')"
                  placeholder="Minimum 6 characters"
                />
                <div class="error-text" *ngIf="isRegisterFieldInvalid('password')">Min 6 characters required.</div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg btn-full mt-3">Create Free Account</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div class="modal-overlay" *ngIf="showForgotModal" (click)="showForgotModal = false">
        <div class="modal-card card" (click)="$event.stopPropagation()">
          <h3>Reset Password</h3>
          <p class="text-muted">Enter your email address to receive password reset instructions.</p>
          <div class="form-group mt-3">
            <input type="email" class="form-control" placeholder="Enter your email address" [(ngModel)]="resetEmail" />
          </div>
          <div class="modal-actions mt-4">
            <button class="btn btn-secondary" (click)="showForgotModal = false">Cancel</button>
            <button class="btn btn-primary" (click)="sendResetLink()">Send Reset Link</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; justify-content: center; align-items: center; min-height: 70vh; padding: 3rem 1.5rem; }
    .auth-card { width: 100%; max-width: 460px; overflow: hidden; }

    .auth-tabs { display: flex; border-bottom: 1px solid var(--slate-200); background: var(--slate-50); }
    .auth-tabs button { flex: 1; padding: 1.1rem; font-weight: 700; color: var(--slate-500); border-bottom: 3px solid transparent; }
    .auth-tabs button.active { color: var(--primary-600); background: #ffffff; border-bottom-color: var(--primary-600); }

    .auth-body { padding: 2.25rem; }
    .auth-heading { font-size: 1.5rem; font-weight: 800; color: var(--slate-900); margin-bottom: 0.25rem; }
    .auth-subtext { font-size: 0.88rem; color: var(--slate-500); margin-bottom: 1.5rem; }

    .label-row { display: flex; justify-content: space-between; align-items: center; }
    .forgot-link { font-size: 0.8rem; color: var(--primary-600); font-weight: 600; }

    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .flex-1 { flex: 1; }

    .demo-accounts-box {
      background: var(--slate-100);
      padding: 1rem;
      border-radius: var(--radius-md);
      font-size: 0.82rem;
    }
    .demo-title { font-weight: 700; color: var(--slate-800); display: block; margin-bottom: 0.6rem; }
    .demo-btn-group { display: flex; gap: 0.5rem; }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-card { width: 100%; max-width: 400px; padding: 2rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
  `]
})
export class LoginComponent implements OnInit {
  activeTab: 'login' | 'register' = 'login';
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  showForgotModal = false;
  resetEmail = '';
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.loginForm = this.fb.group({
      email: ['user@shop.com', [Validators.required, Validators.email]],
      password: ['password123', [Validators.required, Validators.minLength(4)]]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isLoginFieldInvalid(field: string): boolean {
    const f = this.loginForm.get(field);
    return f ? f.invalid && (f.dirty || f.touched) : false;
  }

  isRegisterFieldInvalid(field: string): boolean {
    const f = this.registerForm.get(field);
    return f ? f.invalid && (f.dirty || f.touched) : false;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    const success = this.authService.login(email, password);
    if (success) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigateByUrl(this.returnUrl);
      }
    }
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.value;
    const success = this.authService.register(name, email, password);
    if (success) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  fillCustomerDemo() {
    this.loginForm.patchValue({ email: 'user@shop.com', password: 'password123' });
    this.onLogin();
  }

  fillAdminDemo() {
    this.loginForm.patchValue({ email: 'admin@shop.com', password: 'admin123' });
    this.onLogin();
  }

  sendResetLink() {
    if (this.resetEmail && this.resetEmail.includes('@')) {
      this.notification.success(`Password reset instructions sent to ${this.resetEmail}`, 'Reset Link Sent');
      this.showForgotModal = false;
      this.resetEmail = '';
    } else {
      this.notification.error('Please enter a valid email address.');
    }
  }
}
