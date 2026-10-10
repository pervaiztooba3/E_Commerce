import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirmation-page container" *ngIf="order; else loading">
      <div class="confirmation-card card fade-in">
        <!-- Success Hero Header -->
        <div class="success-icon-box">
          <span>🎉</span>
        </div>
        <h1 class="heading-lg text-center">Thank You for Your Order!</h1>
        <p class="text-center text-muted sub-text">
          Your order <strong>{{ order.id }}</strong> has been placed and is currently <strong>{{ order.orderStatus }}</strong>.
        </p>

        <!-- Tracking Notice -->
        <div class="tracking-banner">
          <div>
            <span>Tracking Number: <strong>{{ order.trackingNumber }}</strong></span>
            <span class="d-block text-muted text-xs">Estimated Delivery Date: {{ order.estimatedDelivery }}</span>
          </div>
          <span class="badge badge-success">{{ order.orderStatus }}</span>
        </div>

        <!-- Receipt Table -->
        <div class="receipt-section">
          <h3 class="section-title">Order Items Summary</h3>
          <div class="item-row" *ngFor="let item of order.items">
            <img [src]="item.image" [alt]="item.title" />
            <div class="flex-1">
              <strong>{{ item.title }}</strong>
              <span class="text-muted">Quantity: {{ item.quantity }} × \${{ item.price.toFixed(2) }}</span>
            </div>
            <strong class="item-total">\${{ (item.price * item.quantity).toFixed(2) }}</strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row">
            <span>Subtotal</span>
            <strong>\${{ order.subtotal.toFixed(2) }}</strong>
          </div>
          <div class="summary-row text-success" *ngIf="order.discountAmount > 0">
            <span>Discount</span>
            <strong>-\${{ order.discountAmount.toFixed(2) }}</strong>
          </div>
          <div class="summary-row">
            <span>Shipping Charge</span>
            <strong>\${{ order.shippingFee.toFixed(2) }}</strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row total-row">
            <span>Total Paid</span>
            <span class="total-amount">\${{ order.total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Shipping & Payment Details -->
        <div class="details-grid">
          <div class="details-box">
            <h4>Shipping Address</h4>
            <p><strong>{{ order.customerName }}</strong></p>
            <p>{{ order.shippingAddress }}</p>
            <p>{{ order.city }}, {{ order.postalCode }}</p>
            <p>Phone: {{ order.customerPhone }}</p>
          </div>

          <div class="details-box">
            <h4>Payment Method</h4>
            <p><strong>{{ order.paymentMethod.toUpperCase() }}</strong></p>
            <p>Payment Status: <span class="badge badge-primary">{{ order.paymentStatus }}</span></p>
            <p class="text-muted text-xs">A confirmation invoice was sent to {{ order.customerEmail }}</p>
          </div>
        </div>

        <div class="action-footer">
          <a routerLink="/account" [queryParams]="{ tab: 'orders' }" class="btn btn-secondary">
            View Order History
          </a>
          <a routerLink="/products" class="btn btn-primary">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="container text-center py-5">
        <p>Loading order confirmation details...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .confirmation-page { padding: 3rem 1.5rem; display: flex; justify-content: center; }
    .confirmation-card { width: 100%; max-width: 680px; padding: 3rem; }

    .success-icon-box {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #D1FAE5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.25rem;
      margin: 0 auto 1.25rem auto;
    }

    .sub-text { margin-bottom: 2rem; font-size: 1rem; }
    .text-center { text-align: center; }

    .tracking-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: var(--slate-100);
      border-radius: var(--radius-md);
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }
    .d-block { display: block; }
    .text-xs { font-size: 0.78rem; }

    .receipt-section { margin-bottom: 2rem; }
    .section-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; }

    .item-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.85rem; font-size: 0.9rem; }
    .item-row img { width: 52px; height: 52px; border-radius: var(--radius-sm); object-fit: cover; }
    .flex-1 { flex: 1; display: flex; flex-direction: column; }
    .item-total { font-weight: 700; color: var(--slate-900); }

    .summary-divider { height: 1px; background: var(--slate-200); margin: 1rem 0; }
    .summary-row { display: flex; justify-content: space-between; font-size: 0.92rem; margin-bottom: 0.5rem; color: var(--slate-700); }
    .total-row { font-size: 1.15rem; font-weight: 800; color: var(--slate-900); }
    .total-amount { color: var(--primary-600); font-size: 1.35rem; }

    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
    .details-box { background: var(--slate-50); padding: 1.25rem; border-radius: var(--radius-md); font-size: 0.88rem; }
    .details-box h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--slate-900); }

    .action-footer { display: flex; justify-content: center; gap: 1rem; }

    @media (max-width: 600px) {
      .details-grid { grid-template-columns: 1fr; }
      .confirmation-card { padding: 1.75rem; }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order?: Order;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.params['id'];
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe(o => {
        this.order = o;
      });
    }
  }
}
