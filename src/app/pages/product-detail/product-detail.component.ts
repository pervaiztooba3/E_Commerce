import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { NotificationService } from '../../services/notification.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="product-detail-page container" *ngIf="product; else loadingState">
      <!-- Breadcrumb Nav -->
      <div class="breadcrumb">
        <a routerLink="/">Home</a> /
        <a routerLink="/products">Catalog</a> /
        <a [routerLink]="['/products']" [queryParams]="{ category: product.category }">{{ product.category }}</a> /
        <span>{{ product.title }}</span>
      </div>

      <!-- Main Grid Layout -->
      <div class="detail-grid card">
        <!-- Image Gallery Section -->
        <div class="gallery-container">
          <div class="main-image-box">
            <img [src]="selectedImage || product.images[0]" [alt]="product.title" class="main-image" />
            <span class="badge badge-danger discount-tag" *ngIf="product.discountPercentage">
              -{{ product.discountPercentage }}% OFF
            </span>
          </div>

          <div class="thumbnail-list" *ngIf="product.images.length > 1">
            <button
              *ngFor="let img of product.images"
              class="thumbnail-btn"
              [class.active]="(selectedImage || product.images[0]) === img"
              (click)="selectedImage = img"
            >
              <img [src]="img" [alt]="product.title" />
            </button>
          </div>
        </div>

        <!-- Product Summary & Purchase Options -->
        <div class="summary-container">
          <div class="category-badge">{{ product.category }}</div>
          <h1 class="heading-md product-title">{{ product.title }}</h1>

          <!-- Rating & Stock -->
          <div class="rating-stock-row">
            <div class="rating-box">
              <span class="stars">★★★★★</span>
              <strong class="rating-val">{{ product.rating }}</strong>
              <span class="reviews-link">({{ product.reviewCount }} verified customer reviews)</span>
            </div>
            <div class="stock-badge" [class.in-stock]="product.stock > 0">
              ● {{ product.stock > 0 ? 'In Stock (' + product.stock + ' left)' : 'Out of Stock' }}
            </div>
          </div>

          <!-- Price Box -->
          <div class="price-section">
            <span class="price-current">\${{ product.price.toFixed(2) }}</span>
            <span class="price-original" *ngIf="product.originalPrice > product.price">
              \${{ product.originalPrice.toFixed(2) }}
            </span>
            <span class="price-savings" *ngIf="product.originalPrice > product.price">
              You save \${{ (product.originalPrice - product.price).toFixed(2) }}
            </span>
          </div>

          <p class="description-text">{{ product.description }}</p>

          <!-- Color Variants Picker -->
          <div class="variant-group" *ngIf="product.colors && product.colors.length > 0">
            <label class="variant-label">Color: <strong>{{ selectedColor || product.colors[0] }}</strong></label>
            <div class="color-options">
              <button
                *ngFor="let c of product.colors"
                class="color-circle"
                [style.background-color]="c"
                [class.active]="(selectedColor || product.colors[0]) === c"
                (click)="selectedColor = c"
              ></button>
            </div>
          </div>

          <!-- Size Variants Picker -->
          <div class="variant-group" *ngIf="product.sizes && product.sizes.length > 0">
            <label class="variant-label">Size: <strong>{{ selectedSize || product.sizes[0] }}</strong></label>
            <div class="size-options">
              <button
                *ngFor="let s of product.sizes"
                class="size-pill"
                [class.active]="(selectedSize || product.sizes[0]) === s"
                (click)="selectedSize = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Quantity Selector & Action Buttons -->
          <div class="action-row">
            <div class="quantity-selector">
              <button (click)="decreaseQty()">-</button>
              <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stock" readonly />
              <button (click)="increaseQty()">+</button>
            </div>

            <button class="btn btn-primary btn-lg flex-1" (click)="addToCart()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              Add to Cart
            </button>

            <button class="btn btn-secondary btn-lg" (click)="buyNow()">
              Buy Now
            </button>

            <button class="wishlist-btn-large" [class.active]="isInWishlist" (click)="toggleWishlist()" title="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" [attr.fill]="isInWishlist ? '#F43F5E' : 'none'" [attr.stroke]="isInWishlist ? '#F43F5E' : 'currentColor'" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>

          <!-- Extra Delivery Guarantees -->
          <div class="delivery-guarantee-box">
            <div class="guarantee-item">
              <span>🚚</span>
              <div>
                <strong>Free Expedited Delivery</strong>
                <span>Estimated arrival in 3-5 business days</span>
              </div>
            </div>
            <div class="guarantee-item">
              <span>🛡️</span>
              <div>
                <strong>30 Days Return Guarantee</strong>
                <span>Free returns with full original packaging refund</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs (Specifications & Customer Reviews) -->
      <div class="detail-tabs card">
        <div class="tab-buttons">
          <button [class.active]="activeTab === 'specs'" (click)="activeTab = 'specs'">Specifications</button>
          <button [class.active]="activeTab === 'reviews'" (click)="activeTab = 'reviews'">
            Customer Reviews ({{ product.reviews?.length || 0 }})
          </button>
        </div>

        <div class="tab-body" [ngSwitch]="activeTab">
          <!-- Specifications Tab -->
          <div *ngSwitchCase="'specs'" class="specs-grid">
            <div *ngFor="let key of getSpecKeys(product.specifications)" class="spec-row">
              <span class="spec-key">{{ key }}</span>
              <span class="spec-val">{{ product.specifications![key] }}</span>
            </div>
            <div *ngIf="!product.specifications" class="text-muted">Standard product specifications apply.</div>
          </div>

          <!-- Customer Reviews Tab -->
          <div *ngSwitchCase="'reviews'" class="reviews-tab">
            <div *ngFor="let rev of product.reviews" class="review-item">
              <div class="review-header">
                <strong>{{ rev.userName }}</strong>
                <span class="review-date">{{ rev.date }}</span>
              </div>
              <div class="stars">★★★★★</div>
              <p class="review-comment">{{ rev.comment }}</p>
            </div>
            <div *ngIf="!product.reviews || product.reviews.length === 0" class="text-muted">
              Be the first customer to leave a review for {{ product.title }}!
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Grid -->
      <section class="related-section" *ngIf="(relatedProducts$ | async) as related">
        <div class="section-header" *ngIf="related.length > 0">
          <h2 class="heading-md">Related Products You May Like</h2>
        </div>
        <div class="products-grid">
          <app-product-card *ngFor="let prod of related" [product]="prod"></app-product-card>
        </div>
      </section>
    </div>

    <ng-template #loadingState>
      <div class="container text-center py-5">
        <div class="skeleton" style="height: 400px; width: 100%;"></div>
      </div>
    </ng-template>
  `,
  styles: [`
    .product-detail-page { padding: 2.5rem 1.5rem; }
    .breadcrumb { font-size: 0.85rem; color: var(--slate-400); margin-bottom: 1.5rem; }
    .breadcrumb a { color: var(--primary-600); }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      padding: 2.5rem;
      margin-bottom: 2.5rem;
    }

    .gallery-container { display: flex; flex-direction: column; gap: 1rem; }
    .main-image-box {
      position: relative;
      width: 100%;
      padding-top: 80%;
      background-color: var(--slate-100);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .main-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .discount-tag { position: absolute; top: 1rem; left: 1rem; }

    .thumbnail-list { display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.25rem; }
    .thumbnail-btn {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      border: 2px solid transparent;
      padding: 0;
    }
    .thumbnail-btn img { width: 100%; height: 100%; object-fit: cover; }
    .thumbnail-btn.active { border-color: var(--primary-600); }

    .category-badge { font-size: 0.8rem; font-weight: 700; color: var(--primary-600); text-transform: uppercase; margin-bottom: 0.4rem; }
    .product-title { color: var(--slate-900); margin-bottom: 0.75rem; }

    .rating-stock-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .rating-box { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; }
    .stars { color: #F59E0B; }
    .reviews-link { color: var(--slate-400); font-size: 0.82rem; }
    .stock-badge { font-size: 0.82rem; font-weight: 700; color: var(--accent-rose); }
    .stock-badge.in-stock { color: var(--accent-emerald-dark); }

    .price-section { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.25rem; }
    .price-current { font-size: 2rem; font-weight: 800; color: var(--slate-900); }
    .price-original { font-size: 1.1rem; color: var(--slate-400); text-decoration: line-through; }
    .price-savings { font-size: 0.85rem; font-weight: 700; color: var(--accent-emerald-dark); background: #D1FAE5; padding: 0.2rem 0.5rem; border-radius: 4px; }

    .description-text { font-size: 0.98rem; color: var(--slate-600); line-height: 1.6; margin-bottom: 1.75rem; }

    .variant-group { margin-bottom: 1.25rem; }
    .variant-label { font-size: 0.88rem; display: block; margin-bottom: 0.5rem; color: var(--slate-700); }

    .color-options { display: flex; gap: 0.6rem; }
    .color-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--slate-200);
      cursor: pointer;
    }
    .color-circle.active { border-color: var(--primary-600); transform: scale(1.15); }

    .size-options { display: flex; gap: 0.6rem; }
    .size-pill {
      padding: 0.45rem 1rem;
      border: 1.5px solid var(--slate-200);
      border-radius: var(--radius-sm);
      background: #ffffff;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .size-pill.active { border-color: var(--primary-600); background: var(--primary-50); color: var(--primary-700); }

    .action-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .quantity-selector {
      display: flex;
      align-items: center;
      border: 1.5px solid var(--slate-200);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .quantity-selector button { width: 38px; height: 44px; font-weight: bold; background: var(--slate-100); }
    .quantity-selector input { width: 44px; text-align: center; border: none; font-weight: bold; outline: none; }

    .flex-1 { flex: 1; }
    .wishlist-btn-large {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      border: 1.5px solid var(--slate-200);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
    }
    .wishlist-btn-large.active { border-color: var(--accent-rose); background: #FFE4E6; }

    .delivery-guarantee-box {
      border-top: 1px solid var(--slate-200);
      padding-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .guarantee-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.88rem; }
    .guarantee-item span { font-size: 1.4rem; }
    .guarantee-item strong { display: block; color: var(--slate-900); }
    .guarantee-item span { color: var(--slate-500); }

    /* Tabs */
    .detail-tabs { margin-bottom: 3rem; }
    .tab-buttons { display: flex; border-bottom: 1px solid var(--slate-200); }
    .tab-buttons button {
      padding: 1rem 1.75rem;
      font-weight: 700;
      color: var(--slate-500);
      border-bottom: 3px solid transparent;
    }
    .tab-buttons button.active { color: var(--primary-600); border-bottom-color: var(--primary-600); }
    .tab-body { padding: 2rem; }

    .specs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .spec-row { display: flex; justify-content: space-between; padding: 0.6rem 1rem; background: var(--slate-50); border-radius: var(--radius-sm); font-size: 0.9rem; }
    .spec-key { font-weight: 600; color: var(--slate-700); }

    .review-item { border-bottom: 1px solid var(--slate-200); padding-bottom: 1rem; margin-bottom: 1rem; }
    .review-header { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.3rem; }
    .review-date { color: var(--slate-400); }
    .review-comment { font-size: 0.92rem; color: var(--slate-600); margin-top: 0.4rem; }

    .related-section { margin-top: 3rem; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }

    @media (max-width: 900px) {
      .detail-grid { grid-template-columns: 1fr; padding: 1.5rem; }
      .specs-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  selectedImage?: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity = 1;
  activeTab = 'specs';

  relatedProducts$!: Observable<Product[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.productService.getProductById(id).subscribe(p => {
          if (p) {
            this.product = p;
            this.selectedImage = p.images[0];
            this.selectedColor = p.colors ? p.colors[0] : undefined;
            this.selectedSize = p.sizes ? p.sizes[0] : undefined;
            this.relatedProducts$ = this.productService.getRelatedProducts(p.category, p.id);
          } else {
            this.router.navigate(['/products']);
          }
        });
      }
    });
  }

  get isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }

  toggleWishlist() {
    if (this.product) {
      this.wishlistService.toggleWishlist(this.product);
    }
  }

  increaseQty() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedColor, this.selectedSize);
    }
  }

  buyNow() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedColor, this.selectedSize);
      this.router.navigate(['/checkout']);
    }
  }

  getSpecKeys(specs?: Record<string, string>): string[] {
    return specs ? Object.keys(specs) : [];
  }
}
