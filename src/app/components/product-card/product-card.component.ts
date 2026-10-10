import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card card">
      <!-- Card Image Header -->
      <div class="product-image-container">
        <a [routerLink]="['/product', product.id]">
          <img
            [src]="product.images[0]"
            [alt]="product.title"
            class="product-image"
            loading="lazy"
          />
        </a>

        <!-- Badges -->
        <div class="product-badges">
          <span class="badge badge-danger" *ngIf="product.discountPercentage > 0">
            -{{ product.discountPercentage }}%
          </span>
          <span class="badge badge-primary" *ngIf="product.isNewArrival && !product.discountPercentage">
            New
          </span>
          <span class="badge badge-success" *ngIf="product.isTrending && !product.isNewArrival">
            Hot
          </span>
        </div>

        <!-- Wishlist Button -->
        <button
          class="wishlist-btn"
          [class.active]="isInWishlist"
          (click)="toggleWishlist($event)"
          title="Toggle Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" [attr.fill]="isInWishlist ? '#F43F5E' : 'none'" [attr.stroke]="isInWishlist ? '#F43F5E' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
      </div>

      <!-- Card Body -->
      <div class="product-info">
        <div class="product-category">{{ product.category }}</div>
        <h3 class="product-title">
          <a [routerLink]="['/product', product.id]">{{ product.title }}</a>
        </h3>

        <!-- Rating -->
        <div class="product-rating">
          <div class="stars">
            <span *ngFor="let star of [1,2,3,4,5]" [class.filled]="star <= product.rating">★</span>
          </div>
          <span class="rating-value">{{ product.rating }}</span>
          <span class="review-count">({{ product.reviewCount }})</span>
        </div>

        <!-- Pricing & Action -->
        <div class="product-footer">
          <div class="price-box">
            <span class="current-price">\${{ product.price.toFixed(2) }}</span>
            <span class="original-price" *ngIf="product.originalPrice > product.price">
              \${{ product.originalPrice.toFixed(2) }}
            </span>
          </div>

          <button class="btn btn-primary btn-sm add-cart-btn" (click)="addToCart($event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      background: #ffffff;
      border-radius: var(--radius-lg, 16px);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
    }

    .product-image-container {
      position: relative;
      width: 100%;
      padding-top: 85%;
      overflow: hidden;
      background-color: var(--slate-100, #f1f5f9);
      border-radius: var(--radius-lg, 16px) var(--radius-lg, 16px) 0 0;
    }

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.06);
    }

    .product-badges {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      z-index: 2;
    }

    .wishlist-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--slate-600);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      transition: all 0.2s ease;
      z-index: 2;
    }

    .wishlist-btn:hover {
      background: #ffffff;
      transform: scale(1.1);
      color: var(--accent-rose);
    }

    .wishlist-btn.active {
      background: #ffffff;
      color: var(--accent-rose);
    }

    .product-info {
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-category {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--primary-600);
      margin-bottom: 0.3rem;
    }

    .product-title {
      font-size: 0.98rem;
      font-weight: 700;
      line-height: 1.35;
      color: var(--slate-800);
      margin-bottom: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.7rem;
    }

    .product-title a:hover {
      color: var(--primary-600);
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.82rem;
      margin-bottom: 0.85rem;
    }

    .stars {
      color: #CBD5E1;
      display: flex;
      gap: 1px;
    }

    .stars .filled {
      color: var(--accent-amber);
    }

    .rating-value {
      font-weight: 700;
      color: var(--slate-700);
    }

    .review-count {
      color: var(--slate-400);
      font-size: 0.78rem;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid var(--slate-100);
    }

    .price-box {
      display: flex;
      flex-direction: column;
    }

    .current-price {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--slate-900);
    }

    .original-price {
      font-size: 0.8rem;
      color: var(--slate-400);
      text-decoration: line-through;
    }

    .add-cart-btn {
      padding: 0.5rem 0.9rem;
      border-radius: var(--radius-sm);
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  get isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.wishlistService.toggleWishlist(this.product);
  }

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const defaultColor = this.product.colors ? this.product.colors[0] : undefined;
    const defaultSize = this.product.sizes ? this.product.sizes[0] : undefined;
    this.cartService.addToCart(this.product, 1, defaultColor, defaultSize);
  }
}
