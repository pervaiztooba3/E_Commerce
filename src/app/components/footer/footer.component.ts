import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <!-- Brand Info -->
        <div class="footer-col brand-col">
          <a routerLink="/" class="footer-logo">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <span class="logo-text">AURA<span>STORE</span></span>
          </a>
          <p class="brand-desc">
            Your destination for luxury audio, smart technology, handcrafted leather accessories, and sustainable lifestyle essentials.
          </p>
          <div class="social-links">
            <a href="javascript:void(0)" aria-label="Twitter">Twitter</a>
            <a href="javascript:void(0)" aria-label="Instagram">Instagram</a>
            <a href="javascript:void(0)" aria-label="LinkedIn">LinkedIn</a>
            <a href="javascript:void(0)" aria-label="YouTube">YouTube</a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="footer-title">Quick Links</h4>
          <ul class="footer-links">
            <li><a routerLink="/products">Shop All Catalog</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'Electronics' }">Electronics & Audio</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'Fashion' }">Fashion & Leather</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'Home & Kitchen' }">Home & Living</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'Beauty & Care' }">Beauty & Care</a></li>
          </ul>
        </div>

        <!-- Customer Care -->
        <div class="footer-col">
          <h4 class="footer-title">Customer Care</h4>
          <ul class="footer-links">
            <li><a routerLink="/account">My Account</a></li>
            <li><a routerLink="/account" [queryParams]="{ tab: 'orders' }">Track Order History</a></li>
            <li><a routerLink="/wishlist">Saved Wishlist</a></li>
            <li><a routerLink="/cart">Shopping Cart</a></li>
            <li><a routerLink="/login">Login / Register</a></li>
          </ul>
        </div>

        <!-- Newsletter Subscription -->
        <div class="footer-col newsletter-col">
          <h4 class="footer-title">Stay Inspired</h4>
          <p class="newsletter-desc">Subscribe to receive exclusive preview sales, new arrivals, and special coupon codes.</p>
          <form (ngSubmit)="subscribeNewsletter()" class="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email..."
              [(ngModel)]="emailInput"
              name="emailInput"
              required
              class="newsletter-input"
            />
            <button type="submit" class="btn btn-primary btn-sm">Subscribe</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-wrapper">
          <p>© 2026 AURA STORE Inc. All Rights Reserved. Built with Angular & TypeScript.</p>
          <div class="payment-icons">
            <span class="pay-badge">VISA</span>
            <span class="pay-badge">MASTERCARD</span>
            <span class="pay-badge">PAYPAL</span>
            <span class="pay-badge">APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--slate-900);
      color: #94A3B8;
      padding-top: 4rem;
      margin-top: 5rem;
    }
    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 2fr;
      gap: 3rem;
      padding-bottom: 3.5rem;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
      margin-bottom: 1rem;
    }
    .logo-icon {
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, var(--primary-600), var(--accent-violet));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-text { font-size: 1.25rem; font-weight: 800; color: #ffffff; }
    .logo-text span { color: var(--primary-500); }
    .brand-desc { font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.25rem; }

    .social-links { display: flex; gap: 1rem; font-size: 0.85rem; font-weight: 600; }
    .social-links a { color: #CBD5E1; }
    .social-links a:hover { color: var(--primary-500); }

    .footer-title { color: #ffffff; font-size: 1rem; font-weight: 700; margin-bottom: 1.2rem; }
    .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; }
    .footer-links a { font-size: 0.88rem; color: #94A3B8; transition: color 0.2s; }
    .footer-links a:hover { color: #ffffff; }

    .newsletter-desc { font-size: 0.88rem; line-height: 1.5; margin-bottom: 1rem; }
    .newsletter-form { display: flex; gap: 0.5rem; }
    .newsletter-input {
      flex: 1;
      padding: 0.6rem 0.9rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--slate-700);
      background-color: var(--slate-800);
      color: #ffffff;
      font-size: 0.88rem;
    }
    .newsletter-input:focus { border-color: var(--primary-500); outline: none; }

    .footer-bottom {
      border-top: 1px solid var(--slate-800);
      padding: 1.5rem 0;
      font-size: 0.82rem;
    }
    .bottom-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .payment-icons { display: flex; gap: 0.5rem; }
    .pay-badge {
      padding: 0.2rem 0.5rem;
      background: var(--slate-800);
      border: 1px solid var(--slate-700);
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 800;
      color: #CBD5E1;
    }

    @media (max-width: 900px) {
      .footer-content { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 600px) {
      .footer-content { grid-template-columns: 1fr; }
    }
  `]
})
export class FooterComponent {
  emailInput = '';

  constructor(private notification: NotificationService) {}

  subscribeNewsletter() {
    if (this.emailInput && this.emailInput.includes('@')) {
      this.notification.success('Thank you for subscribing to AURA STORE newsletter!', 'Subscribed');
      this.emailInput = '';
    } else {
      this.notification.error('Please enter a valid email address.');
    }
  }
}
