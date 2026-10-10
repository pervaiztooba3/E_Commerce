import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { CategoryService } from '../../services/category.service';
import { CouponService } from '../../services/coupon.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';
import { Order, OrderStatus } from '../../models/order.model';
import { Category } from '../../models/category.model';
import { Coupon } from '../../models/coupon.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-page container">
      <div class="admin-header">
        <div>
          <h1 class="heading-lg">Admin Management Dashboard</h1>
          <p class="text-muted">Manage store inventory, catalog products, customer orders, categories & promo coupons.</p>
        </div>
        <div class="admin-actions">
          <button class="btn btn-primary" (click)="openAddProductModal()">+ Add New Product</button>
        </div>
      </div>

      <!-- KPI Statistics Cards -->
      <div class="kpi-grid mb-4">
        <div class="kpi-card card">
          <div class="kpi-icon icon-emerald">💰</div>
          <div>
            <span class="kpi-label">Total Revenue</span>
            <strong class="kpi-value">\${{ adminStats.totalSales.toFixed(2) }}</strong>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-icon icon-indigo">📦</div>
          <div>
            <span class="kpi-label">Total Orders</span>
            <strong class="kpi-value">{{ adminStats.totalOrders }}</strong>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-icon icon-amber">⏳</div>
          <div>
            <span class="kpi-label">Pending Fulfillment</span>
            <strong class="kpi-value">{{ adminStats.pendingOrders }}</strong>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-icon icon-violet">🏷️</div>
          <div>
            <span class="kpi-label">Total Products</span>
            <strong class="kpi-value">{{ (products$ | async)?.length || 0 }}</strong>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="admin-tabs card mb-4">
        <button [class.active]="activeTab === 'products'" (click)="activeTab = 'products'">
          📦 Product Inventory
        </button>
        <button [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'">
          📑 Order Statuses
        </button>
        <button [class.active]="activeTab === 'categories'" (click)="activeTab = 'categories'">
          📂 Categories
        </button>
        <button [class.active]="activeTab === 'coupons'" (click)="activeTab = 'coupons'">
          🎟️ Promo Coupons
        </button>
      </div>

      <!-- TAB 1: PRODUCT MANAGEMENT -->
      <div *ngIf="activeTab === 'products'" class="tab-content card fade-in">
        <div class="table-header">
          <h3>Products Catalog ({{ (products$ | async)?.length }})</h3>
          <input
            type="text"
            class="form-control table-search"
            placeholder="Search products..."
            [(ngModel)]="productFilterQuery"
          />
        </div>

        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of getFilteredProducts(products$ | async)">
                <td class="product-cell">
                  <img [src]="p.images[0]" [alt]="p.title" />
                  <div>
                    <strong>{{ p.title }}</strong>
                    <span class="d-block text-muted text-xs">ID: {{ p.id }}</span>
                  </div>
                </td>
                <td><span class="badge badge-primary">{{ p.category }}</span></td>
                <td><strong>\${{ p.price.toFixed(2) }}</strong></td>
                <td>
                  <span class="badge" [class.badge-success]="p.stock > 10" [class.badge-danger]="p.stock <= 10">
                    {{ p.stock }} in stock
                  </span>
                </td>
                <td>{{ p.rating }}★ ({{ p.reviewCount }})</td>
                <td class="action-cell">
                  <button class="btn btn-secondary btn-sm" (click)="editProduct(p)">Edit</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteProduct(p.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: ORDER MANAGEMENT -->
      <div *ngIf="activeTab === 'orders'" class="tab-content card fade-in">
        <h3 class="mb-3">Customer Orders Fulfillment</h3>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of orders$ | async">
                <td><strong>{{ o.id }}</strong></td>
                <td>
                  <div>
                    <strong>{{ o.customerName }}</strong>
                    <span class="d-block text-muted text-xs">{{ o.customerEmail }}</span>
                  </div>
                </td>
                <td>{{ o.createdAt | date:'shortDate' }}</td>
                <td><strong>\${{ o.total.toFixed(2) }}</strong></td>
                <td>
                  <span class="badge" [class.badge-success]="o.paymentStatus === 'Paid'" [class.badge-warning]="o.paymentStatus === 'Pending'">
                    {{ o.paymentStatus }} ({{ o.paymentMethod.toUpperCase() }})
                  </span>
                </td>
                <td>
                  <select
                    class="form-control status-select"
                    [ngModel]="o.orderStatus"
                    (ngModelChange)="updateOrderStatus(o.id, $event)"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <span class="text-muted text-xs">Tracking: {{ o.trackingNumber }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: CATEGORY MANAGEMENT -->
      <div *ngIf="activeTab === 'categories'" class="tab-content card fade-in">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3>Store Categories</h3>
          <button class="btn btn-primary btn-sm" (click)="showCategoryModal = true">+ Add Category</button>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of categories$ | async">
                <td><strong>{{ c.name }}</strong></td>
                <td><code>{{ c.slug }}</code></td>
                <td>{{ c.description }}</td>
                <td>
                  <button class="btn btn-danger btn-sm" (click)="deleteCategory(c.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: COUPON MANAGEMENT -->
      <div *ngIf="activeTab === 'coupons'" class="tab-content card fade-in">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3>Promo Coupon Codes</h3>
          <button class="btn btn-primary btn-sm" (click)="showCouponModal = true">+ Create Coupon</button>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min Purchase</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of coupons$ | async">
                <td><code>{{ c.code }}</code></td>
                <td><strong>{{ c.discountValue }}% OFF</strong></td>
                <td>\${{ c.minPurchase }}</td>
                <td>
                  <span class="badge" [class.badge-success]="c.isActive" [class.badge-slate]="!c.isActive">
                    {{ c.isActive ? 'Active' : 'Disabled' }}
                  </span>
                </td>
                <td class="action-cell">
                  <button class="btn btn-secondary btn-sm" (click)="toggleCoupon(c.code)">Toggle Status</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteCoupon(c.code)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Product Add / Edit Modal -->
      <div class="modal-overlay" *ngIf="showProductModal" (click)="showProductModal = false">
        <div class="modal-card card" (click)="$event.stopPropagation()">
          <h3>{{ editingProductId ? 'Edit Product' : 'Add New Product' }}</h3>
          <form (ngSubmit)="saveProduct()">
            <div class="form-group mt-3">
              <label class="form-label">Title *</label>
              <input type="text" [(ngModel)]="prodForm.title" name="title" class="form-control" required />
            </div>
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Price (\$) *</label>
                <input type="number" [(ngModel)]="prodForm.price" name="price" class="form-control" required />
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Original Price (\$) *</label>
                <input type="number" [(ngModel)]="prodForm.originalPrice" name="originalPrice" class="form-control" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Category *</label>
                <select [(ngModel)]="prodForm.category" name="category" class="form-control" required>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Beauty & Care">Beauty & Care</option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                </select>
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Stock Units *</label>
                <input type="number" [(ngModel)]="prodForm.stock" name="stock" class="form-control" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Image URL *</label>
              <input type="text" [(ngModel)]="prodImageUrl" name="imageUrl" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Description *</label>
              <textarea [(ngModel)]="prodForm.description" name="description" class="form-control" rows="3" required></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="showProductModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Product</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Category Modal -->
      <div class="modal-overlay" *ngIf="showCategoryModal" (click)="showCategoryModal = false">
        <div class="modal-card card" (click)="$event.stopPropagation()">
          <h3>Add Category</h3>
          <form (ngSubmit)="saveCategory()">
            <div class="form-group mt-3">
              <label class="form-label">Category Name *</label>
              <input type="text" [(ngModel)]="catForm.name" name="catName" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <input type="text" [(ngModel)]="catForm.description" name="catDesc" class="form-control" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="showCategoryModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Category</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Coupon Modal -->
      <div class="modal-overlay" *ngIf="showCouponModal" (click)="showCouponModal = false">
        <div class="modal-card card" (click)="$event.stopPropagation()">
          <h3>Create Promo Coupon</h3>
          <form (ngSubmit)="saveCoupon()">
            <div class="form-group mt-3">
              <label class="form-label">Coupon Code *</label>
              <input type="text" [(ngModel)]="couponForm.code" name="code" class="form-control" placeholder="e.g. SUMMER30" required />
            </div>
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Discount % *</label>
                <input type="number" [(ngModel)]="couponForm.discountValue" name="discountValue" class="form-control" required />
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Min Purchase \$ *</label>
                <input type="number" [(ngModel)]="couponForm.minPurchase" name="minPurchase" class="form-control" required />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="showCouponModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Coupon</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { padding: 2.5rem 1.5rem; }
    .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }

    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .kpi-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; }
    .kpi-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .icon-emerald { background: #D1FAE5; }
    .icon-indigo { background: #E0E7FF; }
    .icon-amber { background: #FEF3C7; }
    .icon-violet { background: #EDE9FE; }
    .kpi-label { font-size: 0.82rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase; }
    .kpi-value { display: block; font-size: 1.5rem; font-weight: 800; color: var(--slate-900); }

    .admin-tabs { display: flex; overflow-x: auto; }
    .admin-tabs button { flex: 1; padding: 1rem 1.25rem; font-weight: 700; color: var(--slate-600); border-bottom: 3px solid transparent; text-align: center; }
    .admin-tabs button.active { color: var(--primary-600); border-bottom-color: var(--primary-600); }

    .tab-content { padding: 2rem; }
    .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .table-search { max-width: 300px; }

    .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
    .admin-table th { padding: 0.75rem 1rem; font-size: 0.82rem; color: var(--slate-500); text-transform: uppercase; border-bottom: 1px solid var(--slate-200); }
    .admin-table td { padding: 1rem; border-bottom: 1px solid var(--slate-100); font-size: 0.9rem; vertical-align: middle; }

    .product-cell { display: flex; align-items: center; gap: 0.75rem; min-width: 240px; }
    .product-cell img { width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; }
    .action-cell { display: flex; gap: 0.5rem; }

    .status-select { padding: 0.35rem 0.6rem; font-size: 0.85rem; width: auto; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .modal-card { width: 100%; max-width: 550px; padding: 2rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }

    .mb-4 { margin-bottom: 1.5rem; }
    .mb-3 { margin-bottom: 1rem; }
    .mt-3 { margin-top: 1rem; }
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .form-row { display: flex; gap: 1rem; }
    .flex-1 { flex: 1; }

    @media (max-width: 900px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .kpi-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab: 'products' | 'orders' | 'categories' | 'coupons' = 'products';
  productFilterQuery = '';

  products$!: Observable<Product[]>;
  orders$!: Observable<Order[]>;
  categories$!: Observable<Category[]>;
  coupons$!: Observable<Coupon[]>;

  adminStats = { totalSales: 0, totalOrders: 0, pendingOrders: 0 };

  // Modals state
  showProductModal = false;
  editingProductId?: string;
  prodForm: Partial<Product> = {};
  prodImageUrl = '';

  showCategoryModal = false;
  catForm: Partial<Category> = {};

  showCouponModal = false;
  couponForm: Partial<Coupon> = { discountType: 'percentage', isActive: true, minPurchase: 50 };

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private couponService: CouponService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
    this.orders$ = this.orderService.getOrders();
    this.categories$ = this.categoryService.getCategories();
    this.coupons$ = this.couponService.getCoupons();

    this.orderService.getAdminStats().subscribe(stats => {
      this.adminStats = stats;
    });
  }

  getFilteredProducts(products: Product[] | null): Product[] {
    if (!products) return [];
    if (!this.productFilterQuery.trim()) return products;
    const q = this.productFilterQuery.toLowerCase().trim();
    return products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  // Product CRUD
  openAddProductModal() {
    this.editingProductId = undefined;
    this.prodForm = {
      title: '',
      price: 99,
      originalPrice: 129,
      category: 'Electronics',
      stock: 30,
      description: '',
      rating: 4.8,
      reviewCount: 12,
      discountPercentage: 23
    };
    this.prodImageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
    this.showProductModal = true;
  }

  editProduct(product: Product) {
    this.editingProductId = product.id;
    this.prodForm = { ...product };
    this.prodImageUrl = product.images[0];
    this.showProductModal = true;
  }

  saveProduct() {
    if (this.prodForm.title && this.prodForm.price) {
      const discount = Math.round(((this.prodForm.originalPrice! - this.prodForm.price) / this.prodForm.originalPrice!) * 100);
      const productData: Omit<Product, 'id'> = {
        title: this.prodForm.title,
        price: Number(this.prodForm.price),
        originalPrice: Number(this.prodForm.originalPrice),
        discountPercentage: discount > 0 ? discount : 0,
        category: this.prodForm.category || 'Electronics',
        description: this.prodForm.description || '',
        stock: Number(this.prodForm.stock || 20),
        images: [this.prodImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
        rating: this.prodForm.rating || 4.8,
        reviewCount: this.prodForm.reviewCount || 10
      };

      if (this.editingProductId) {
        this.productService.updateProduct({ ...productData, id: this.editingProductId });
        this.notification.success('Product updated successfully!');
      } else {
        this.productService.addProduct(productData);
        this.notification.success('New product created!');
      }
      this.showProductModal = false;
    }
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
      this.notification.info('Product deleted.');
    }
  }

  // Order Management
  updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    this.orderService.updateOrderStatus(orderId, newStatus);
  }

  // Category Management
  saveCategory() {
    if (this.catForm.name) {
      const slug = this.catForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      this.categoryService.addCategory({
        name: this.catForm.name,
        slug,
        icon: 'folder',
        image: 'https://images.unsplash.com/photo-1498049860654-af1a5c57abf3?w=600&auto=format&fit=crop&q=80',
        itemCount: 10,
        description: this.catForm.description || ''
      });
      this.showCategoryModal = false;
      this.catForm = {};
    }
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id);
  }

  // Coupon Management
  saveCoupon() {
    if (this.couponForm.code && this.couponForm.discountValue) {
      this.couponService.addCoupon({
        code: this.couponForm.code.toUpperCase(),
        discountType: 'percentage',
        discountValue: Number(this.couponForm.discountValue),
        minPurchase: Number(this.couponForm.minPurchase || 50),
        isActive: true,
        description: `${this.couponForm.discountValue}% OFF orders over $${this.couponForm.minPurchase}`
      });
      this.showCouponModal = false;
      this.couponForm = { discountType: 'percentage', isActive: true, minPurchase: 50 };
    }
  }

  toggleCoupon(code: string) {
    this.couponService.toggleCouponStatus(code);
  }

  deleteCoupon(code: string) {
    this.couponService.deleteCoupon(code);
  }
}
