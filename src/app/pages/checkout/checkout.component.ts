import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { CartItem, CartSummary } from '../../models/cart.model';
import { PaymentMethod } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="checkout-page container">
      <!-- Breadcrumb Nav -->
      <div class="breadcrumb">
        <a routerLink="/">Home</a> / <a routerLink="/cart">Cart</a> / <span>Checkout</span>
      </div>
      <h1 class="heading-lg mb-4">Secure Checkout</h1>

      <div class="checkout-layout" *ngIf="items.length > 0; else emptyCheckout">
        <!-- Main Form Section -->
        <form [formGroup]="checkoutForm" (ngSubmit)="onSubmitOrder()" class="checkout-form">
          <!-- Customer Info Step -->
          <div class="form-card card">
            <h3 class="card-section-title">1. Contact & Delivery Details</h3>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Full Name *</label>
                <input
                  type="text"
                  formControlName="fullName"
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('fullName')"
                  placeholder="e.g. John Doe"
                />
                <div class="error-text" *ngIf="isFieldInvalid('fullName')">Full name is required.</div>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Email Address *</label>
                <input
                  type="email"
                  formControlName="email"
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('email')"
                  placeholder="name@example.com"
                />
                <div class="error-text" *ngIf="isFieldInvalid('email')">Valid email is required.</div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Phone Number *</label>
                <input
                  type="tel"
                  formControlName="phone"
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('phone')"
                  placeholder="+1 (555) 000-0000"
                />
                <div class="error-text" *ngIf="isFieldInvalid('phone')">Phone number is required.</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Street Shipping Address *</label>
              <input
                type="text"
                formControlName="address"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('address')"
                placeholder="123 Main Street, Apt or Suite"
              />
              <div class="error-text" *ngIf="isFieldInvalid('address')">Street address is required.</div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">City *</label>
                <input
                  type="text"
                  formControlName="city"
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('city')"
                  placeholder="Springfield"
                />
                <div class="error-text" *ngIf="isFieldInvalid('city')">City is required.</div>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Postal / Zip Code *</label>
                <input
                  type="text"
                  formControlName="postalCode"
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('postalCode')"
                  placeholder="97477"
                />
                <div class="error-text" *ngIf="isFieldInvalid('postalCode')">Postal code is required.</div>
              </div>
            </div>
          </div>

          <!-- Payment Method Step -->
          <div class="form-card card mt-4">
            <h3 class="card-section-title">2. Select Payment Method</h3>

            <div class="payment-options">
              <!-- Cash on Delivery -->
              <label class="payment-option-card" [class.active]="selectedPayment === 'cod'">
                <input
                  type="radio"
                  formControlName="paymentMethod"
                  value="cod"
                />
                <div class="option-content">
                  <span class="option-title">💵 Cash on Delivery (COD)</span>
                  <span class="option-desc">Pay with cash upon package delivery at your doorstep.</span>
                </div>
              </label>

              <!-- Credit / Debit Card -->
              <label class="payment-option-card" [class.active]="selectedPayment === 'card'">
                <input
                  type="radio"
                  formControlName="paymentMethod"
                  value="card"
                />
                <div class="option-content">
                  <span class="option-title">💳 Credit / Debit Card</span>
                  <span class="option-desc">Instant secure payment via Visa, Mastercard, or Amex.</span>
                </div>
              </label>

              <!-- Bank Transfer -->
              <label class="payment-option-card" [class.active]="selectedPayment === 'bank'">
                <input
                  type="radio"
                  formControlName="paymentMethod"
                  value="bank"
                />
                <div class="option-content">
                  <span class="option-title">🏛️ Direct Bank Wire Transfer</span>
                  <span class="option-desc">Transfer funds directly from your banking application.</span>
                </div>
              </label>
            </div>

            <!-- Card Sub-Form -->
            <div class="card-details-box fade-in" *ngIf="selectedPayment === 'card'">
              <div class="form-group">
                <label class="form-label">Cardholder Name</label>
                <input type="text" class="form-control" placeholder="Name on Card" formControlName="cardName" />
              </div>
              <div class="form-row">
                <div class="form-group flex-2">
                  <label class="form-label">Card Number</label>
                  <input type="text" class="form-control" placeholder="4532 •••• •••• 8892" formControlName="cardNumber" />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Expiry</label>
                  <input type="text" class="form-control" placeholder="MM/YY" formControlName="cardExpiry" />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">CVV</label>
                  <input type="text" class="form-control" placeholder="123" formControlName="cardCvv" />
                </div>
              </div>
            </div>

            <!-- Bank Transfer Notice -->
            <div class="bank-notice-box fade-in" *ngIf="selectedPayment === 'bank'">
              <p><strong>Bank Account Details:</strong></p>
              <p>Bank: AURA Commerce Trust Bank</p>
              <p>Account Name: AURA STORE INC</p>
              <p>Account Number: 9812-4019-3382</p>
              <p>Routing Code: 021000021</p>
              <span class="text-muted text-sm">Please reference your Order ID in the transfer payment description.</span>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg btn-full mt-4 submit-order-btn"
            [disabled]="isSubmitting"
          >
            <span *ngIf="!isSubmitting">Place Order Now (\${{ summary.total.toFixed(2) }})</span>
            <span *ngIf="isSubmitting">Processing Order...</span>
          </button>
        </form>

        <!-- Order Summary Sidebar -->
        <aside class="checkout-summary card">
          <h3 class="summary-title">Order Items ({{ items.length }})</h3>

          <div class="summary-item-list">
            <div *ngFor="let item of items" class="summary-item">
              <img [src]="item.product.images[0]" [alt]="item.product.title" />
              <div class="item-info">
                <strong>{{ item.product.title }}</strong>
                <span class="text-muted">Qty: {{ item.quantity }} × \${{ item.product.price.toFixed(2) }}</span>
              </div>
              <span class="item-price">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row">
            <span>Subtotal</span>
            <strong>\${{ summary.subtotal.toFixed(2) }}</strong>
          </div>

          <div class="summary-row text-success" *ngIf="summary.discount > 0">
            <span>Discount ({{ summary.appliedCoupon }})</span>
            <strong>-\${{ summary.discount.toFixed(2) }}</strong>
          </div>

          <div class="summary-row">
            <span>Shipping</span>
            <strong *ngIf="summary.shipping > 0">\${{ summary.shipping.toFixed(2) }}</strong>
            <strong class="text-success" *ngIf="summary.shipping === 0">FREE</strong>
          </div>

          <div class="summary-row">
            <span>Tax (5%)</span>
            <strong>\${{ summary.tax.toFixed(2) }}</strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row total-row">
            <span>Total Payable</span>
            <span class="total-amount">\${{ summary.total.toFixed(2) }}</span>
          </div>
        </aside>
      </div>

      <ng-template #emptyCheckout>
        <div class="empty-checkout card text-center py-5">
          <h2>No items in cart to checkout</h2>
          <a routerLink="/products" class="btn btn-primary mt-3">Return to Store</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .checkout-page { padding: 2.5rem 1.5rem; }
    .breadcrumb { font-size: 0.85rem; color: var(--slate-400); margin-bottom: 0.5rem; }
    .breadcrumb a { color: var(--primary-600); }
    .mb-4 { margin-bottom: 1.5rem; }
    .mt-4 { margin-top: 1.5rem; }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 2rem;
      align-items: start;
    }

    .form-card { padding: 2rem; }
    .card-section-title { font-size: 1.15rem; font-weight: 800; color: var(--slate-900); margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--slate-100); }

    .form-row { display: flex; gap: 1rem; }
    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }

    .payment-options { display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem; }
    .payment-option-card {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border: 1.5px solid var(--slate-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      background: #ffffff;
      transition: all 0.2s ease;
    }
    .payment-option-card.active { border-color: var(--primary-600); background: var(--primary-50); }
    .option-title { display: block; font-weight: 700; font-size: 0.95rem; color: var(--slate-900); }
    .option-desc { display: block; font-size: 0.82rem; color: var(--slate-500); margin-top: 0.2rem; }

    .card-details-box, .bank-notice-box {
      background: var(--slate-100);
      padding: 1.25rem;
      border-radius: var(--radius-md);
      margin-top: 1rem;
    }

    .submit-order-btn { height: 52px; font-size: 1.1rem; }

    /* Summary Sidebar */
    .checkout-summary { padding: 1.5rem; }
    .summary-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 1rem; }
    .summary-item-list { display: flex; flex-direction: column; gap: 0.85rem; max-height: 320px; overflow-y: auto; }
    .summary-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; }
    .summary-item img { width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; }
    .item-info { flex: 1; display: flex; flex-direction: column; }
    .item-price { font-weight: 700; color: var(--slate-900); }

    .summary-divider { height: 1px; background: var(--slate-200); margin: 1rem 0; }
    .summary-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--slate-700); }
    .total-row { font-size: 1.1rem; font-weight: 800; color: var(--slate-900); }
    .total-amount { color: var(--primary-600); font-size: 1.3rem; }

    @media (max-width: 900px) {
      .checkout-layout { grid-template-columns: 1fr; }
      .form-row { flex-direction: column; gap: 0; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  items: CartItem[] = [];
  summary!: CartSummary;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cartItems => {
      this.items = cartItems;
      this.summary = this.cartService.getCartSummary();
    });

    const user = this.authService.getUser();

    this.checkoutForm = this.fb.group({
      fullName: [user ? user.name : '', Validators.required],
      email: [user ? user.email : '', [Validators.required, Validators.email]],
      phone: [user ? user.phone || '' : '', Validators.required],
      address: [user ? user.address || '' : '', Validators.required],
      city: [user ? user.city || '' : '', Validators.required],
      postalCode: [user ? user.postalCode || '' : '', Validators.required],
      paymentMethod: ['card', Validators.required],
      cardName: [''],
      cardNumber: [''],
      cardExpiry: [''],
      cardCvv: ['']
    });
  }

  get selectedPayment(): PaymentMethod {
    return this.checkoutForm.get('paymentMethod')?.value as PaymentMethod;
  }

  isFieldInvalid(field: string): boolean {
    const f = this.checkoutForm.get(field);
    return f ? f.invalid && (f.dirty || f.touched) : false;
  }

  onSubmitOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.notification.error('Please complete all required shipping fields correctly.', 'Validation Error');
      return;
    }

    this.isSubmitting = true;
    const formVal = this.checkoutForm.value;
    const user = this.authService.getUser();

    const orderPayload = {
      userId: user ? user.id : 'guest-user',
      customerName: formVal.fullName,
      customerEmail: formVal.email,
      customerPhone: formVal.phone,
      shippingAddress: formVal.address,
      city: formVal.city,
      postalCode: formVal.postalCode,
      items: this.items.map(i => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
        selectedColor: i.selectedColor,
        selectedSize: i.selectedSize
      })),
      subtotal: this.summary.subtotal,
      shippingFee: this.summary.shipping,
      discountAmount: this.summary.discount,
      total: this.summary.total,
      paymentMethod: formVal.paymentMethod as PaymentMethod,
      paymentStatus: formVal.paymentMethod === 'card' ? ('Paid' as const) : ('Pending' as const)
    };

    setTimeout(() => {
      const createdOrder = this.orderService.createOrder(orderPayload);
      this.cartService.clearCart();
      this.isSubmitting = false;
      this.router.navigate(['/order-confirmation', createdOrder.id]);
    }, 1200);
  }
}
