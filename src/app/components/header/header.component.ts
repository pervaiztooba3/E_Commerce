import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Top Announcement Bar -->
    <div class="top-banner">
      <div class="container banner-content">
        <span>✨ FREE EXPEDITED SHIPPING ON ALL ORDERS OVER $100 — USE CODE <strong>FREESHIP</strong></span>
        <div class="top-links">
          <a routerLink="/products" [queryParams]="{ sort: 'newest' }">New Season Releases</a>
          <span>|</span>
          <a routerLink="/admin" *ngIf="authService.isAdmin()">Admin Panel</a>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <header class="main-header">
      <div class="container header-wrapper">
        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" (click)="toggleMobileMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <!-- Brand Logo -->
        <a routerLink="/" class="brand-logo">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <span class="logo-text">AURA<span>STORE</span></span>
        </a>

        <!-- Search Bar -->
        <div class="search-box">
          <form (ngSubmit)="onSearchSubmit()">
            <input
              type="text"
              placeholder="Search premium headphones, watches, bags, serum..."
              [(ngModel)]="searchQuery"
              name="searchQuery"
              class="search-input"
            />
            <button type="submit" class="search-btn" title="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </form>
        </div>

        <!-- Action Items (Account, Wishlist, Cart) -->
        <div class="header-actions">
          <!-- User Account Menu -->
          <div class="user-menu-container" (mouseenter)="showUserMenu = true" (mouseleave)="showUserMenu = false">
            <ng-container *ngIf="authService.currentUser$ | async as user; else guestAuth">
              <button class="action-btn user-btn" routerLink="/account">
                <img [src]="user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'" class="user-avatar" [alt]="user.name" />
                <span class="user-name-label">{{ user.name.split(' ')[0] }}</span>
              </button>
              <!-- Dropdown -->
              <div class="user-dropdown card" *ngIf="showUserMenu">
                <div class="user-dropdown-header">
                  <strong>{{ user.name }}</strong>
                  <span class="text-muted">{{ user.email }}</span>
                  <span class="badge badge-primary" *ngIf="user.role === 'admin'">Admin</span>
                </div>
                <div class="dropdown-divider"></div>
                <a routerLink="/account" class="dropdown-item">My Account & Profile</a>
                <a routerLink="/account" [queryParams]="{ tab: 'orders' }" class="dropdown-item">Order History</a>
                <a routerLink="/wishlist" class="dropdown-item">My Wishlist</a>
                <a routerLink="/admin" *ngIf="user.role === 'admin'" class="dropdown-item admin-link">Admin Dashboard</a>
                <div class="dropdown-divider"></div>
                <button (click)="logout()" class="dropdown-item logout-btn">Log Out</button>
              </div>
            </ng-container>

            <ng-template #guestAuth>
              <a routerLink="/login" class="btn btn-secondary btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Sign In
              </a>
            </ng-template>
          </div>

          <!-- Wishlist Icon -->
          <a routerLink="/wishlist" class="action-btn wishlist-icon-btn" title="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span class="counter-badge" *ngIf="(wishlistCount$ | async) as count" [class.show]="count > 0">
              {{ count }}
            </span>
          </a>

          <!-- Cart Icon -->
          <a routerLink="/cart" class="action-btn cart-icon-btn" title="Shopping Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span class="counter-badge cart-badge" *ngIf="(cartCount$ | async) as count" [class.show]="count > 0">
              {{ count }}
            </span>
          </a>
        </div>
      </div>

      <!-- Navigation Bar -->
      <nav class="main-nav">
        <div class="container nav-wrapper">
          <ul class="nav-links">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
            <li><a routerLink="/products" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">All Products</a></li>
            <li *ngFor="let cat of categories$ | async">
              <a [routerLink]="['/products']" [queryParams]="{ category: cat.name }">{{ cat.name }}</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <!-- Mobile Drawer Overlay -->
    <div class="mobile-drawer-overlay" *ngIf="isMobileMenuOpen" (click)="toggleMobileMenu()"></div>
    <div class="mobile-drawer" [class.open]="isMobileMenuOpen">
      <div class="drawer-header">
        <div class="brand-logo">
          <span class="logo-text">AURA<span>STORE</span></span>
        </div>
        <button (click)="toggleMobileMenu()" class="close-drawer">×</button>
      </div>

      <div class="drawer-content">
        <ul class="mobile-nav-list">
          <li><a routerLink="/" (click)="toggleMobileMenu()">Home</a></li>
          <li><a routerLink="/products" (click)="toggleMobileMenu()">All Products</a></li>
          <li><a routerLink="/cart" (click)="toggleMobileMenu()">Shopping Cart</a></li>
          <li><a routerLink="/wishlist" (click)="toggleMobileMenu()">Wishlist</a></li>
          <li><a routerLink="/account" (click)="toggleMobileMenu()">My Account</a></li>
          <li *ngIf="authService.isAdmin()"><a routerLink="/admin" (click)="toggleMobileMenu()" class="text-primary">Admin Dashboard</a></li>
        </ul>

        <div class="drawer-categories">
          <h4>Explore Categories</h4>
          <ul>
            <li *ngFor="let cat of categories$ | async">
              <a [routerLink]="['/products']" [queryParams]="{ category: cat.name }" (click)="toggleMobileMenu()">
                {{ cat.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .top-banner {
      background-color: var(--slate-900);
      color: #94A3B8;
      font-size: 0.8rem;
      padding: 0.45rem 0;
      border-bottom: 1px solid var(--slate-800);
    }
    .banner-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .banner-content strong { color: #F59E0B; }
    .top-links { display: flex; gap: 0.75rem; align-items: center; }
    .top-links a:hover { color: #ffffff; }

    .main-header {
      background: #ffffff;
      border-bottom: 1px solid var(--slate-200);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }

    .header-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 76px;
      gap: 1.5rem;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
    }
    .logo-icon {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, var(--primary-600), var(--accent-violet));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .logo-text {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--slate-900);
    }
    .logo-text span { color: var(--primary-600); }

    .search-box {
      flex: 1;
      max-width: 480px;
    }
    .search-box form {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-input {
      width: 100%;
      padding: 0.65rem 2.75rem 0.65rem 1.1rem;
      background-color: var(--slate-100);
      border: 1.5px solid transparent;
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }
    .search-input:focus {
      background-color: #ffffff;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }
    .search-btn {
      position: absolute;
      right: 0.5rem;
      background: var(--primary-600);
      color: #ffffff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .action-btn {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--slate-700);
      transition: color 0.2s ease;
    }
    .action-btn:hover { color: var(--primary-600); }

    .counter-badge {
      position: absolute;
      top: -6px;
      right: -8px;
      background-color: var(--accent-rose);
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 800;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .counter-badge.show { display: flex; }
    .cart-badge { background-color: var(--primary-600); }

    .user-menu-container {
      position: relative;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-100);
    }
    .user-name-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--slate-800);
    }
    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 230px;
      padding: 0.75rem 0;
      z-index: 200;
      margin-top: 0.5rem;
    }
    .user-dropdown-header {
      padding: 0.5rem 1rem;
      display: flex;
      flex-direction: column;
      font-size: 0.85rem;
    }
    .dropdown-divider {
      height: 1px;
      background-color: var(--slate-200);
      margin: 0.4rem 0;
    }
    .dropdown-item {
      display: block;
      padding: 0.5rem 1rem;
      font-size: 0.88rem;
      color: var(--slate-700);
      width: 100%;
      text-align: left;
    }
    .dropdown-item:hover {
      background-color: var(--slate-100);
      color: var(--primary-600);
    }
    .admin-link { color: var(--primary-600); font-weight: 700; }
    .logout-btn { color: var(--accent-rose); }

    /* Navigation Bar */
    .main-nav {
      background: var(--slate-50);
      border-top: 1px solid var(--slate-200);
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
      padding: 0.65rem 0;
    }
    .nav-links a {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--slate-700);
      padding: 0.25rem 0;
      position: relative;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--primary-600);
    }

    .mobile-toggle {
      display: none;
      color: var(--slate-800);
    }

    /* Mobile Drawer */
    .mobile-drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
    .mobile-drawer {
      position: fixed;
      top: 0;
      left: 0;
      width: 280px;
      height: 100%;
      background: #ffffff;
      z-index: 1000;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    .mobile-drawer.open { transform: translateX(0); }
    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      border-bottom: 1px solid var(--slate-200);
    }
    .close-drawer { font-size: 1.75rem; color: var(--slate-500); }
    .drawer-content { padding: 1.25rem; overflow-y: auto; }
    .mobile-nav-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
    .mobile-nav-list a { font-weight: 700; font-size: 1.05rem; color: var(--slate-800); }
    .drawer-categories h4 { font-size: 0.85rem; text-transform: uppercase; color: var(--slate-400); margin-bottom: 0.75rem; }
    .drawer-categories ul { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
    .drawer-categories a { color: var(--slate-600); font-size: 0.92rem; }

    @media (max-width: 900px) {
      .top-links { display: none; }
      .search-box { display: none; }
      .main-nav { display: none; }
      .mobile-toggle { display: block; }
      .user-name-label { display: none; }
    }
  `]
})
export class HeaderComponent implements OnInit {
  searchQuery = '';
  showUserMenu = false;
  isMobileMenuOpen = false;

  cartCount$!: Observable<number>;
  wishlistCount$!: Observable<number>;
  categories$!: Observable<Category[]>;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartCount$ = this.cartService.getCartCount();
    this.wishlistCount$ = this.wishlistService.getWishlistCount();
    this.categories$ = this.categoryService.getCategories();
  }

  onSearchSubmit() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }
}
