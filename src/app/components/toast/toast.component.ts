import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of notification.toasts$ | async"
        class="toast-card fade-in"
        [ngClass]="'toast-' + toast.type"
      >
        <div class="toast-icon">
          <span *ngIf="toast.type === 'success'">✓</span>
          <span *ngIf="toast.type === 'error'">✕</span>
          <span *ngIf="toast.type === 'warning'">⚠</span>
          <span *ngIf="toast.type === 'info'">ℹ</span>
        </div>
        <div class="toast-body">
          <div class="toast-title" *ngIf="toast.title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" (click)="notification.remove(toast.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      width: calc(100% - 3rem);
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1.1rem;
      background: #ffffff;
      border-radius: var(--radius-md, 12px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      border-left: 4px solid var(--primary-600);
      position: relative;
    }

    .toast-success { border-left-color: #10B981; }
    .toast-error { border-left-color: #F43F5E; }
    .toast-warning { border-left-color: #F59E0B; }
    .toast-info { border-left-color: #3B82F6; }

    .toast-icon {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.85rem;
      color: #fff;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .toast-success .toast-icon { background: #10B981; }
    .toast-error .toast-icon { background: #F43F5E; }
    .toast-warning .toast-icon { background: #F59E0B; }
    .toast-info .toast-icon { background: #3B82F6; }

    .toast-body {
      flex: 1;
    }

    .toast-title {
      font-weight: 700;
      font-size: 0.9rem;
      color: #1E293B;
      margin-bottom: 2px;
    }

    .toast-message {
      font-size: 0.85rem;
      color: #64748B;
      line-height: 1.35;
    }

    .toast-close {
      font-size: 1.25rem;
      color: #94A3B8;
      line-height: 1;
      padding: 0 4px;
      margin-top: -2px;
      margin-right: -4px;
    }
    .toast-close:hover {
      color: #0F172A;
    }
  `]
})
export class ToastComponent {
  constructor(public notification: NotificationService) {}
}
