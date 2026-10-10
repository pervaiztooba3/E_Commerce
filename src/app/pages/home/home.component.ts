import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <!-- Hero Banner Section -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-text fade-in">
          <span class="badge badge-primary hero-badge">SPRING 2026 COLLECTION</span>
          <h1 class="heading-xl hero-title">
            Elevate Your Everyday <span class="gradient-text">Lifestyle & Tech</span>
          </h1>
          <p class="hero-desc">
            Discover precision-engineered audio, luxury handcrafted leather goods, smart home accessories, and botanical skincare crafted for modern living.
          </p>
          <div class="hero-actions">
            <a routerLink="/products" class="btn btn-primary btn-lg">
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a routerLink="/products" [queryParams]="{ category: 'Electronics' }" class="btn btn-secondary btn-lg">
              Explore Tech
            </a>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">15K+</span>
              <span class="stat-label">Happy Customers</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">4.9★</span>
              <span class="stat-label">Average Rating</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">24/7</span>
              <span class="stat-label">Express Delivery</span>
            </div>
          </div>
        </div>

        <div class="hero-image-box">
          <div class="hero-card-glow"></div>
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
            alt="Hero Headphones"
            class="hero-image"
          />
          <div class="floating-tag tag-top">
            <div class="tag-icon">🎧</div>
            <div>
              <strong>Spatial Audio</strong>
              <span>AuraSound Pro</span>
            </div>
          </div>
          <div class="floating-tag tag-bottom">
            <div class="tag-icon">🔥</div>
            <div>
              <strong>Save 25% Off</strong>
              <span>Code: SAVE10</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Features Highlights -->
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <div>
              <h4>Free Express Shipping</h4>
              <p>On all US orders over $100</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <div>
              <h4>2-Year Warranty</h4>
              <p>100% authentic products guaranteed</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <div>
              <h4>30-Day Hassle Returns</h4>
              <p>Easy returns & instant refund policy</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💳</div>
            <div>
              <h4>Encrypted Checkout</h4>
              <p>Card, COD, & Bank Transfer options</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories Grid -->
    <section class="section categories-section">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-subtitle">EXPLORE CATALOG</span>
            <h2 class="heading-lg">Featured Categories</h2>
          </div>
          <a routerLink="/products" class="view-all-link">Browse All Categories →</a>
        </div>

        <div class="categories-grid">
          <div
            *ngFor="let cat of categories$ | async"
            class="category-card"
            [routerLink]="['/products']"
            [queryParams]="{ category: cat.name }"
          >
            <img [src]="cat.image" [alt]="cat.name" class="category-img" />
            <div class="category-overlay">
              <span class="category-count">{{ cat.itemCount }} Items</span>
              <h3 class="category-name">{{ cat.name }}</h3>
              <p class="category-desc">{{ cat.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deal of the Day Promo Banner -->
    <section class="promo-banner-section">
      <div class="container">
        <div class="promo-card">
          <div class="promo-content">
            <span class="badge badge-warning">SPECIAL OFFER</span>
            <h2 class="heading-lg">Limited Time Flash Sale</h2>
            <p>Get an extra <strong>20% OFF</strong> your entire cart when you spend $100 or more. Use promo code at checkout.</p>
            <div class="countdown-timer">
              <div class="time-box"><strong>08</strong><span>Hours</span></div>
              <div class="time-box"><strong>42</strong><span>Mins</span></div>
              <div class="time-box"><strong>19</strong><span>Secs</span></div>
            </div>
            <div class="promo-coupon-code">
              PROMO CODE: <code>WELCOME20</code>
            </div>
            <a routerLink="/products" class="btn btn-primary btn-lg">Shop Deal Products</a>
          </div>
          <div class="promo-img-box">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80" alt="Flash Sale Watch" />
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Products -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-subtitle">POPULAR DEMAND</span>
            <h2 class="heading-lg">Trending Products</h2>
          </div>
          <a routerLink="/products" [queryParams]="{ sort: 'popularity' }" class="view-all-link">See All Trending →</a>
        </div>

        <div class="products-grid">
          <app-product-card
            *ngFor="let product of trendingProducts$ | async"
            [product]="product"
          ></app-product-card>
        </div>
      </div>
    </section>

    <!-- New Arrivals Section -->
    <section class="section bg-light">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-subtitle">FRESH IN STORE</span>
            <h2 class="heading-lg">New Arrivals</h2>
          </div>
          <a routerLink="/products" [queryParams]="{ sort: 'newest' }" class="view-all-link">Explore Newest →</a>
        </div>

        <div class="products-grid">
          <app-product-card
            *ngFor="let product of newArrivals$ | async"
            [product]="product"
          ></app-product-card>
        </div>
      </div>
    </section>

    <!-- Customer Testimonials -->
    <section class="section reviews-section">
      <div class="container">
        <div class="section-header center">
          <span class="section-subtitle">TESTIMONIALS</span>
          <h2 class="heading-lg">Loved by Thousands of Shoppers</h2>
        </div>

        <div class="reviews-grid">
          <div class="review-card card">
            <div class="stars">★★★★★</div>
            <p class="review-text">
              "The AuraSound Pro headphones delivered audio clarity beyond expectations. Fast 2-day delivery and immaculate packaging."
            </p>
            <div class="reviewer">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Sarah J." />
              <div>
                <strong>Sarah Jenkins</strong>
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>

          <div class="review-card card">
            <div class="stars">★★★★★</div>
            <p class="review-text">
              "Handcrafted Italian leather bag is authentic and stunning. Smells amazing and holds all my everyday essentials perfectly."
            </p>
            <div class="reviewer">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="David M." />
              <div>
                <strong>David Miller</strong>
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>

          <div class="review-card card">
            <div class="stars">★★★★★</div>
            <p class="review-text">
              "Customer service was super responsive when I updated my shipping address. Checkout with card was seamless!"
            </p>
            <div class="reviewer">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Elena R." />
              <div>
                <strong>Elena Rostova</strong>
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      padding: 4rem 0 3rem 0;
      background: linear-gradient(180deg, #ffffff 0%, var(--slate-100) 100%);
      overflow: hidden;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 3rem;
      align-items: center;
    }
    .hero-badge { margin-bottom: 1.25rem; font-size: 0.8rem; }
    .hero-title { margin-bottom: 1.25rem; color: var(--slate-900); }
    .gradient-text {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--accent-violet) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-desc {
      font-size: 1.1rem;
      color: var(--slate-600);
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 580px;
    }
    .hero-actions { display: flex; gap: 1rem; margin-bottom: 2.5rem; flex-wrap: wrap; }

    .hero-stats {
      display: flex;
      gap: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--slate-200);
    }
    .stat-number { font-size: 1.5rem; font-weight: 800; color: var(--slate-900); display: block; }
    .stat-label { font-size: 0.85rem; color: var(--slate-500); }

    .hero-image-box {
      position: relative;
      display: flex;
      justify-content: center;
    }
    .hero-image {
      width: 100%;
      max-width: 480px;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
      object-fit: cover;
    }
    .floating-tag {
      position: absolute;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
      padding: 0.75rem 1.1rem;
      border-radius: var(--radius-md);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
    }
    .tag-icon { font-size: 1.4rem; }
    .floating-tag strong { display: block; color: var(--slate-900); }
    .floating-tag span { color: var(--slate-500); font-size: 0.78rem; }
    .tag-top { top: 10%; left: -5%; }
    .tag-bottom { bottom: 10%; right: -5%; }

    /* Features Section */
    .features-section {
      padding: 2.5rem 0;
      background: #ffffff;
      border-bottom: 1px solid var(--slate-200);
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    .feature-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }
    .feature-icon { font-size: 2rem; }
    .feature-card h4 { font-size: 0.95rem; font-weight: 700; color: var(--slate-900); }
    .feature-card p { font-size: 0.82rem; color: var(--slate-500); }

    /* Section Headers */
    .section { padding: 4.5rem 0; }
    .bg-light { background-color: #ffffff; }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
    }
    .section-header.center { text-align: center; justify-content: center; flex-direction: column; }
    .section-subtitle { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; color: var(--primary-600); }
    .view-all-link { font-weight: 700; color: var(--primary-600); font-size: 0.95rem; }

    /* Categories Grid */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 1.5rem;
    }
    .category-card {
      position: relative;
      height: 280px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      cursor: pointer;
    }
    .category-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .category-card:hover .category-img { transform: scale(1.08); }
    .category-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: #ffffff;
    }
    .category-count { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary-100); }
    .category-name { font-size: 1.3rem; font-weight: 800; }
    .category-desc { font-size: 0.82rem; color: #CBD5E1; opacity: 0.9; margin-top: 0.25rem; }

    /* Promo Banner */
    .promo-banner-section { padding: 2rem 0; }
    .promo-card {
      background: linear-gradient(135deg, var(--slate-900) 0%, var(--primary-900) 100%);
      border-radius: 24px;
      padding: 3.5rem;
      color: #ffffff;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 3rem;
      align-items: center;
    }
    .promo-content p { font-size: 1.05rem; margin: 1rem 0 1.5rem 0; color: #CBD5E1; }
    .countdown-timer { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .time-box {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(6px);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      text-align: center;
    }
    .time-box strong { font-size: 1.4rem; display: block; }
    .time-box span { font-size: 0.7rem; text-transform: uppercase; color: #94A3B8; }
    .promo-coupon-code { margin-bottom: 1.5rem; font-size: 0.95rem; }
    .promo-coupon-code code { background: rgba(245, 158, 11, 0.2); color: #F59E0B; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: bold; }
    .promo-img-box img { width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.75rem;
    }

    /* Testimonials */
    .reviews-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
      margin-top: 2.5rem;
    }
    .review-card { padding: 1.75rem; }
    .review-card .stars { color: #F59E0B; margin-bottom: 1rem; font-size: 1.1rem; }
    .review-text { font-size: 0.95rem; color: var(--slate-600); line-height: 1.6; margin-bottom: 1.5rem; }
    .reviewer { display: flex; align-items: center; gap: 0.75rem; }
    .reviewer img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }
    .reviewer strong { font-size: 0.92rem; display: block; color: var(--slate-900); }
    .reviewer span { font-size: 0.78rem; color: var(--slate-400); }

    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr; text-align: center; }
      .hero-desc { margin: 0 auto 2rem auto; }
      .hero-actions { justify-content: center; }
      .hero-stats { justify-content: center; }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .promo-card { grid-template-columns: 1fr; padding: 2rem; }
      .reviews-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .features-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  trendingProducts$!: Observable<Product[]>;
  newArrivals$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.trendingProducts$ = this.productService.getTrendingProducts();
    this.newArrivals$ = this.productService.getNewArrivals();
    this.categories$ = this.categoryService.getCategories();
  }
}
