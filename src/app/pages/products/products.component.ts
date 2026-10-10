import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="products-page container">
      <!-- Breadcrumb Header -->
      <div class="page-header">
        <div class="breadcrumb">
          <a routerLink="/">Home</a> / <span>Catalog</span>
        </div>
        <h1 class="heading-lg">Explore Store Catalog</h1>
        <p class="text-muted">Filtered results for high performance electronics, leather goods, skincare and home decor.</p>
      </div>

      <div class="catalog-layout">
        <!-- Sidebar Filters -->
        <aside class="sidebar-filters card">
          <div class="filter-header">
            <h3>Filters</h3>
            <button class="clear-btn" (click)="resetFilters()">Reset All</button>
          </div>

          <!-- Search Filter -->
          <div class="filter-group">
            <label class="filter-label">Keyword Search</label>
            <input
              type="text"
              class="form-control"
              placeholder="Search by title, tag..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="applyFilters()"
            />
          </div>

          <!-- Category Filter -->
          <div class="filter-group">
            <label class="filter-label">Categories</label>
            <div class="category-radio-list">
              <label class="radio-item">
                <input
                  type="radio"
                  name="category"
                  value="All"
                  [(ngModel)]="selectedCategory"
                  (change)="applyFilters()"
                />
                <span>All Categories</span>
              </label>
              <label *ngFor="let cat of categories$ | async" class="radio-item">
                <input
                  type="radio"
                  name="category"
                  [value]="cat.name"
                  [(ngModel)]="selectedCategory"
                  (change)="applyFilters()"
                />
                <span>{{ cat.name }}</span>
              </label>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="filter-group">
            <label class="filter-label">Price Range (\${{ minPrice }} - \${{ maxPrice }})</label>
            <div class="price-inputs">
              <input
                type="number"
                class="form-control"
                placeholder="Min"
                [(ngModel)]="minPrice"
                (ngModelChange)="applyFilters()"
              />
              <span>to</span>
              <input
                type="number"
                class="form-control"
                placeholder="Max"
                [(ngModel)]="maxPrice"
                (ngModelChange)="applyFilters()"
              />
            </div>
          </div>

          <!-- Rating Filter -->
          <div class="filter-group">
            <label class="filter-label">Minimum Rating</label>
            <select class="form-control" [(ngModel)]="selectedRating" (change)="applyFilters()">
              <option [value]="0">All Ratings</option>
              <option [value]="4.5">4.5★ & Above</option>
              <option [value]="4.0">4.0★ & Above</option>
              <option [value]="3.5">3.5★ & Above</option>
            </select>
          </div>
        </aside>

        <!-- Main Product Grid Container -->
        <main class="catalog-content">
          <!-- Control Bar (Sort, Item count) -->
          <div class="catalog-control-bar card">
            <div class="item-count-text">
              Showing <strong>{{ filteredProducts.length }}</strong> products
            </div>

            <div class="sort-box">
              <label>Sort By:</label>
              <select class="form-control sort-select" [(ngModel)]="selectedSort" (change)="applyFilters()">
                <option value="popularity">Popularity / Reviews</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="products-grid" *ngIf="paginatedProducts.length > 0; else emptyState">
            <app-product-card
              *ngFor="let product of paginatedProducts"
              [product]="product"
            ></app-product-card>
          </div>

          <!-- Empty State -->
          <ng-template #emptyState>
            <div class="empty-catalog card">
              <div class="empty-icon">🔍</div>
              <h3>No matching products found</h3>
              <p class="text-muted">Try adjusting your price range, search query, or selected category filters.</p>
              <button class="btn btn-primary" (click)="resetFilters()">Reset Filters</button>
            </div>
          </ng-template>

          <!-- Pagination Bar -->
          <div class="pagination-bar" *ngIf="totalPages > 1">
            <button
              class="btn btn-secondary btn-sm"
              [disabled]="currentPage === 1"
              (click)="changePage(currentPage - 1)"
            >
              ← Previous
            </button>
            <div class="page-numbers">
              <button
                *ngFor="let p of pageArray"
                class="page-btn"
                [class.active]="p === currentPage"
                (click)="changePage(p)"
              >
                {{ p }}
              </button>
            </div>
            <button
              class="btn btn-secondary btn-sm"
              [disabled]="currentPage === totalPages"
              (click)="changePage(currentPage + 1)"
            >
              Next →
            </button>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .products-page { padding: 2.5rem 1.5rem; }
    .page-header { margin-bottom: 2rem; }
    .breadcrumb { font-size: 0.85rem; color: var(--slate-400); margin-bottom: 0.5rem; }
    .breadcrumb a { color: var(--primary-600); }

    .catalog-layout {
      display: grid;
      grid-template-columns: 270px 1fr;
      gap: 2rem;
    }

    .sidebar-filters {
      padding: 1.5rem;
      align-self: start;
    }
    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--slate-200);
    }
    .clear-btn { font-size: 0.82rem; font-weight: 600; color: var(--accent-rose); }

    .filter-group { margin-bottom: 1.5rem; }
    .filter-label { display: block; font-size: 0.88rem; font-weight: 700; color: var(--slate-800); margin-bottom: 0.6rem; }

    .category-radio-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .radio-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer; color: var(--slate-700); }

    .price-inputs { display: flex; align-items: center; gap: 0.5rem; }

    .catalog-control-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      margin-bottom: 1.75rem;
    }
    .sort-box { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 600; }
    .sort-select { width: auto; padding: 0.45rem 1rem; }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.75rem;
      margin-bottom: 2.5rem;
    }

    .empty-catalog {
      text-align: center;
      padding: 4rem 2rem;
      margin-bottom: 2rem;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .page-numbers { display: flex; gap: 0.4rem; }
    .page-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--slate-200);
      background: #ffffff;
      font-weight: 700;
      color: var(--slate-700);
    }
    .page-btn.active {
      background: var(--primary-600);
      color: #ffffff;
      border-color: var(--primary-600);
    }

    @media (max-width: 900px) {
      .catalog-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductsComponent implements OnInit {
  searchQuery = '';
  selectedCategory = 'All';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedRating = 0;
  selectedSort = 'popularity';

  categories$!: Observable<Category[]>;
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  currentPage = 1;
  pageSize = 9;
  totalPages = 1;
  pageArray: number[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();

    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery = params['search'];
      if (params['category']) this.selectedCategory = params['category'];
      if (params['sort']) this.selectedSort = params['sort'];
      this.applyFilters();
    });
  }

  applyFilters() {
    this.productService.filterProducts(
      this.searchQuery,
      this.selectedCategory,
      this.minPrice || undefined,
      this.maxPrice || undefined,
      this.selectedRating,
      this.selectedSort
    ).subscribe(products => {
      this.filteredProducts = products;
      this.currentPage = 1;
      this.updatePagination();
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
    this.pageArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedRating = 0;
    this.selectedSort = 'popularity';
    this.router.navigate([], { queryParams: {} });
    this.applyFilters();
  }
}
