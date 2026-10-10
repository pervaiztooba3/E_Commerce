import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { CartService } from '../../services/cart.service';
import { CouponService } from '../../services/coupon.service';
import { NotificationService } from '../../services/notification.service';
import { CartItem, CartSummary } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="cart-page container">
      <!-- Breadcrumb Header -->
      <div class="page-header">
        <div class="breadcrumb">
          <a routerLink="/">Home</a> / <span>Shopping Cart</span>
        </div>
        <h1 class="heading-lg">Your Shopping Cart</h1>
      </div>

      <div class="cart-layout" *ngIf="(cartItems$ | async) as items">
        <ng-container *ngIf="items.length > 0; else emptyCart">
          <!-- Cart Table List -->
          <div class="cart-items-section card">
            <div class="table-responsive">
              <table class="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of items">
                    <td class="product-cell">
                      <img [src]="item.product.images[0]" [alt]="item.product.title" class="item-img" />
                      <div class="item-details">
                        <a [routerLink]="['/product', item.product.id]" class="item-title">
                          {{ item.product.title }}
                        </a>
                        <div class="item-variants text-muted">
                          <span *ngIf="item.selectedColor">Color: {{ item.selectedColor }}</span>
                          <span *ngIf="item.selectedSize"> | Size: {{ item.selectedSize }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="price-cell">\${{ item.product.price.toFixed(2) }}</td>
                    <td class="qty-cell">
                      <div class="qty-control">
                        <button (click)="updateQuantity(item, item.quantity - 1)">-</button>
                        <span>{{ item.quantity }}</span>
                        <button (click)="updateQuantity(item, item.quantity + 1)">+</button>
                      </div>
                    </td>
                    <td class="total-cell">\${{ (item.product.price * item.quantity).toFixed(2) }}</td>
                    <td class="action-cell">
                      <button class="remove-btn" (click)="removeItem(item)" title="Remove item">
                        ✕
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="cart-table-footer">
              <a routerLink="/products" class="btn btn-secondary btn-sm">
                ← Continue Shopping
              </a>
              <button class="clear-cart-btn" (click)="clearCart()">Clear Cart</button>
            </div>
          </div>

          <!-- Summary Sidebar -->
          <aside class="cart-summary-section card" *ngIf="summary">
            <h3 class="summary-title">Order Summary</h3>

            <!-- Coupon Code Section -->
            <div class="coupon-box">
              <label class="coupon-label">Have a promo code?</label>
              <div class="coupon-input-group" *ngIf="!summary.appliedCoupon; else activeCoupon">
                <input
                  type="text"
                  placeholder="e.g. SAVE10"
                  [(ngModel)]="couponCodeInput"
                  class="form-control"
                />
                <button class="btn btn-primary btn-sm" (click)="applyCoupon()">Apply</button>
              </div>
              <ng-template #activeCoupon>
                <div class="applied-coupon-tag">
                  <span>Code: <strong>{{ summary.appliedCoupon }}</strong></span>
                  <button (click)="removeCoupon()" title="Remove coupon">✕</button>
                </div>
              </ng-template>
            </div>

            <div class="summary-divider"></div>

            <!-- Price Breakdown -->
            <div class="summary-row">
              <span>Subtotal</span>
              <strong>\${{ summary.subtotal.toFixed(2) }}</strong>
            </div>

            <div class="summary-row text-success" *ngIf="summary.discount > 0">
              <span>Discount</span>
              <strong>-\${{ summary.discount.toFixed(2) }}</strong>
            </div>

            <div class="summary-row">
              <span>Estimated Shipping</span>
              <strong *ngIf="summary.shipping > 0">\${{ summary.shipping.toFixed(2) }}</strong>
              <strong class="text-success" *ngIf="summary.shipping === 0">FREE</strong>
            </div>

            <div class="summary-row">
              <span>Estimated Tax (5%)</span>
              <strong>\${{ summary.tax.toFixed(2) }}</strong>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total-row">
              <span>Total Amount</span>
              <span class="total-amount">\${{ summary.total.toFixed(2) }}</span>
            </div>

            <button class="btn btn-primary btn-lg btn-full checkout-btn" (click)="proceedToCheckout()">
              Proceed to Checkout →
            </button>

            <div class="free-shipping-notice" *ngIf="summary.subtotal < 100">
              Add <strong>\${{ (100 - summary.subtotal).toFixed(2) }}</strong> more to unlock <strong>FREE Expedited Shipping</strong>!
            </div>
          </aside>
        </ng-container>

        <!-- Empty Cart View -->
        <ng-template #emptyCart>
          <div class="empty-cart-card card">
            <div class="empty-icon">🛒</div>
            <h2>Your Shopping Cart is Empty</h2>
            <p class="text-muted">Looks like you haven't added any products to your cart yet.</p>
            <a routerLink="/products" class="btn btn-primary btn-lg">Explore Store Products</a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { padding: 2.5rem 1.5rem; }
    .page-header { margin-bottom: 2rem; }
    .breadcrumb { font-size: 0.85rem; color: var(--slate-400); margin-bottom: 0.5rem; }
    .breadcrumb a { color: var(--primary-600); }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 2rem;
      align-items: start;
    }

    .cart-items-section { padding: 1.5rem; }
    .table-responsive { overflow-x: auto; }

    .cart-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .cart-table th {
      padding: 0.75rem 1rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--slate-500);
      text-transform: uppercase;
      border-bottom: 1px solid var(--slate-200);
    }
    .cart-table td {
      padding: 1.25rem 1rem;
      border-bottom: 1px solid var(--slate-100);
      vertical-align: middle;
    }

    .product-cell { display: flex; align-items: center; gap: 1rem; min-width: 260px; }
    .item-img { width: 64px; height: 64px; border-radius: var(--radius-sm); object-fit: cover; }
    .item-title { font-weight: 700; color: var(--slate-800); font-size: 0.95rem; }
    .item-title:hover { color: var(--primary-600); }
    .item-variants { font-size: 0.8rem; margin-top: 0.2rem; }

    .price-cell { font-weight: 600; color: var(--slate-700); }
    .total-cell { font-weight: 800; color: var(--slate-900); }

    .qty-control {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }
    .qty-control button { width: 28px; height: 32px; background: var(--slate-100); font-weight: bold; }
    .qty-control span { width: 32px; text-align: center; font-size: 0.9rem; font-weight: 600; }

    .remove-btn { color: var(--slate-400); font-size: 1.1rem; }
    .remove-btn:hover { color: var(--accent-rose); }

    .cart-table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.25rem;
    }
    .clear-cart-btn { font-size: 0.85rem; font-weight: 600; color: var(--slate-500); }
    .clear-cart-btn:hover { color: var(--accent-rose); }

    /* Summary Sidebar */
    .cart-summary-section { padding: 1.5rem; }
    .summary-title { font-size: 1.2rem; font-weight: 800; color: var(--slate-900); margin-bottom: 1.25rem; }

    .coupon-box { margin-bottom: 1.25rem; }
    .coupon-label { font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.4rem; color: var(--slate-700); }
    .coupon-input-group { display: flex; gap: 0.5rem; }
    .applied-coupon-tag {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: #FEF3C7;
      color: #92400E;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
    }

    .summary-divider { height: 1px; background: var(--slate-200); margin: 1rem 0; }

    .summary-row { display: flex; justify-content: space-between; font-size: 0.92rem; margin-bottom: 0.65rem; color: var(--slate-700); }
    .total-row { font-size: 1.1rem; font-weight: 800; color: var(--slate-900); }
    .total-amount { color: var(--primary-600); font-size: 1.35rem; }

    .checkout-btn { margin-top: 1.25rem; }

    .free-shipping-notice {
      margin-top: 1.25rem;
      padding: 0.75rem;
      background: var(--primary-50);
      border-radius: var(--radius-sm);
      font-size: 0.82rem;
      color: var(--primary-900);
      text-align: center;
    }

    .empty-cart-card { text-align: center; padding: 4rem 2rem; grid-column: 1 / -1; }
    .empty-icon { font-size: 3.5rem; margin-bottom: 1rem; }

    @media (max-width: 900px) {
      .cart-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  summary!: CartSummary;
  couponCodeInput = '';

  constructor(
    private cartService: CartService,
    private couponService: CouponService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cart$;
    this.cartService.cart$.subscribe(() => {
      this.summary = this.cartService.getCartSummary();
    });
    this.cartService.appliedCoupon$.subscribe(() => {
      this.summary = this.cartService.getCartSummary();
    });
  }

  updateQuantity(item: CartItem, newQty: number) {
    this.cartService.updateQuantity(item.product.id, newQty, item.selectedColor, item.selectedSize);
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id, item.selectedColor, item.selectedSize);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  applyCoupon() {
    if (!this.couponCodeInput.trim()) return;
    const res = this.couponService.validateCoupon(this.couponCodeInput, this.summary.subtotal);
    if (res.valid && res.coupon) {
      this.cartService.applyCoupon(res.coupon.code, res.coupon.discountValue);
      this.couponCodeInput = '';
    } else {
      this.notification.error(res.message);
    }
  }

  removeCoupon() {
    this.cartService.removeCoupon();
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
