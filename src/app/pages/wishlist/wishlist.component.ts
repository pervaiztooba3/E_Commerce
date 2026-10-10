import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { WishlistItem } from '../../models/wishlist.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="wishlist-page container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="breadcrumb">
          <a routerLink="/">Home</a> / <span>Wishlist</span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="heading-lg">Your Saved Wishlist</h1>
          <button class="clear-btn" *ngIf="items.length > 0" (click)="clearWishlist()">Clear Wishlist</button>
        </div>
      </div>

      <div *ngIf="items.length > 0; else emptyWishlist" class="wishlist-grid">
        <app-product-card *ngFor="let item of items" [product]="item.product"></app-product-card>
      </div>

      <ng-template #emptyWishlist>
        <div class="empty-card card text-center py-5">
          <div class="empty-icon">💔</div>
          <h2>Your Wishlist is Empty</h2>
          <p class="text-muted">Save your favorite products to quickly buy them later.</p>
          <a routerLink="/products" class="btn btn-primary mt-3">Explore Catalog</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .wishlist-page { padding: 2.5rem 1.5rem; }
    .page-header { margin-bottom: 2rem; }
    .breadcrumb { font-size: 0.85rem; color: var(--slate-400); margin-bottom: 0.5rem; }
    .breadcrumb a { color: var(--primary-600); }

    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .clear-btn { font-size: 0.85rem; font-weight: 700; color: var(--accent-rose); }

    .wishlist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.75rem; }
    .empty-card { padding: 4rem 2rem; }
    .empty-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .mt-3 { margin-top: 1rem; }
  `]
})
export class WishlistComponent implements OnInit {
  items: WishlistItem[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe(items => {
      this.items = items;
    });
  }

  clearWishlist() {
    this.wishlistService.clearWishlist();
  }
}
