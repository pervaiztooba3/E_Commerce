import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { WishlistService } from '../../services/wishlist.service';
import { NotificationService } from '../../services/notification.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { User, Address } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { WishlistItem } from '../../models/wishlist.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="account-page container" *ngIf="user; else guestView">
      <div class="account-layout">
        <!-- Sidebar Navigation -->
        <aside class="account-sidebar card">
          <div class="user-profile-summary">
            <img [src]="user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'" class="profile-avatar" [alt]="user.name" />
            <h3>{{ user.name }}</h3>
            <span class="text-muted">{{ user.email }}</span>
            <span class="badge badge-primary mt-1" *ngIf="user.role === 'admin'">Admin Account</span>
          </div>

          <div class="sidebar-nav">
            <button [class.active]="activeTab === 'profile'" (click)="activeTab = 'profile'">
              👤 Profile & Account
            </button>
            <button [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'">
              📦 My Orders History
            </button>
            <button [class.active]="activeTab === 'wishlist'" (click)="activeTab = 'wishlist'">
              ❤️ Saved Wishlist
            </button>
            <button [class.active]="activeTab === 'addresses'" (click)="activeTab = 'addresses'">
              📍 Saved Addresses
            </button>
            <button class="logout-btn" (click)="logout()">
              🚪 Logout
            </button>
          </div>
        </aside>

        <!-- Main Content View -->
        <main class="account-content card">
          <!-- TAB 1: PROFILE -->
          <div *ngIf="activeTab === 'profile'" class="fade-in">
            <h2 class="content-heading">Personal Information</h2>
            <p class="text-muted mb-4">Manage your name, email, phone number, and default delivery address.</p>

            <form (ngSubmit)="updateProfile()">
              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Full Name</label>
                  <input type="text" [(ngModel)]="profileData.name" name="name" class="form-control" />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Email Address</label>
                  <input type="email" [(ngModel)]="profileData.email" name="email" class="form-control" readonly />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" [(ngModel)]="profileData.phone" name="phone" class="form-control" />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">City</label>
                  <input type="text" [(ngModel)]="profileData.city" name="city" class="form-control" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Street Address</label>
                <input type="text" [(ngModel)]="profileData.address" name="address" class="form-control" />
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Postal Code</label>
                  <input type="text" [(ngModel)]="profileData.postalCode" name="postalCode" class="form-control" />
                </div>
              </div>

              <button type="submit" class="btn btn-primary mt-3">Save Profile Changes</button>
            </form>
          </div>

          <!-- TAB 2: MY ORDERS -->
          <div *ngIf="activeTab === 'orders'" class="fade-in">
            <h2 class="content-heading">Order History</h2>
            <p class="text-muted mb-4">Track, view receipts, and inspect your order statuses.</p>

            <div class="orders-list" *ngIf="(orders$ | async) as orders">
              <ng-container *ngIf="orders.length > 0; else noOrders">
                <div *ngFor="let order of orders" class="order-item-card card">
                  <div class="order-card-header">
                    <div>
                      <strong>Order {{ order.id }}</strong>
                      <span class="order-date">Placed on {{ order.createdAt | date:'mediumDate' }}</span>
                    </div>
                    <div class="status-badge-group">
                      <span class="badge" [ngClass]="{
                        'badge-warning': order.orderStatus === 'Pending' || order.orderStatus === 'Processing',
                        'badge-primary': order.orderStatus === 'Shipped',
                        'badge-success': order.orderStatus === 'Delivered'
                      }">
                        {{ order.orderStatus }}
                      </span>
                    </div>
                  </div>

                  <div class="order-items-preview">
                    <div *ngFor="let item of order.items" class="preview-thumb">
                      <img [src]="item.image" [alt]="item.title" />
                      <span>x{{ item.quantity }}</span>
                    </div>
                  </div>

                  <div class="order-card-footer">
                    <div>
                      <span>Total Amount: <strong>\${{ order.total.toFixed(2) }}</strong></span>
                      <span class="payment-tag">({{ order.paymentMethod.toUpperCase() }})</span>
                    </div>
                    <button class="btn btn-secondary btn-sm" (click)="selectedOrder = order">
                      View Details Receipt
                    </button>
                  </div>
                </div>
              </ng-container>
              <ng-template #noOrders>
                <div class="text-center py-5">
                  <p class="text-muted">You haven't placed any orders yet.</p>
                  <a routerLink="/products" class="btn btn-primary btn-sm mt-2">Browse Products</a>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- TAB 3: WISHLIST -->
          <div *ngIf="activeTab === 'wishlist'" class="fade-in">
            <h2 class="content-heading">Saved Wishlist Items</h2>
            <p class="text-muted mb-4">Products you've saved to buy later.</p>

            <div class="wishlist-grid" *ngIf="(wishlist$ | async) as items">
              <ng-container *ngIf="items.length > 0; else noWishlist">
                <app-product-card *ngFor="let item of items" [product]="item.product"></app-product-card>
              </ng-container>
              <ng-template #noWishlist>
                <div class="text-center py-5">
                  <p class="text-muted">Your wishlist is currently empty.</p>
                  <a routerLink="/products" class="btn btn-primary btn-sm mt-2">Start Exploring</a>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- TAB 4: SAVED ADDRESSES -->
          <div *ngIf="activeTab === 'addresses'" class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 class="content-heading">Saved Delivery Addresses</h2>
                <p class="text-muted">Manage your default address book for instant checkout.</p>
              </div>
              <button class="btn btn-primary btn-sm" (click)="showAddressModal = true">+ Add Address</button>
            </div>

            <div class="address-grid">
              <div *ngFor="let addr of user.savedAddresses" class="address-card card">
                <span class="badge badge-success" *ngIf="addr.isDefault">Default</span>
                <strong>{{ addr.fullName }}</strong>
                <p>{{ addr.street }}</p>
                <p>{{ addr.city }}, {{ addr.postalCode }}</p>
                <p>Phone: {{ addr.phone }}</p>
                <button class="delete-addr-btn" (click)="deleteAddress(addr.id)">Delete Address</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Order Details View Modal -->
      <div class="modal-overlay" *ngIf="selectedOrder" (click)="selectedOrder = undefined">
        <div class="modal-card card order-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Order Receipt: {{ selectedOrder.id }}</h3>
            <button (click)="selectedOrder = undefined">×</button>
          </div>

          <div class="modal-body">
            <div class="order-summary-box">
              <p><strong>Tracking Number:</strong> {{ selectedOrder.trackingNumber }}</p>
              <p><strong>Estimated Delivery:</strong> {{ selectedOrder.estimatedDelivery }}</p>
              <p><strong>Status:</strong> {{ selectedOrder.orderStatus }}</p>
              <p><strong>Shipping Address:</strong> {{ selectedOrder.shippingAddress }}, {{ selectedOrder.city }} ({{ selectedOrder.postalCode }})</p>
            </div>

            <h4 class="mt-3 mb-2">Purchased Items</h4>
            <div *ngFor="let item of selectedOrder.items" class="modal-item-row">
              <img [src]="item.image" [alt]="item.title" />
              <div class="flex-1">
                <strong>{{ item.title }}</strong>
                <span class="text-muted">Qty: {{ item.quantity }} × \${{ item.price.toFixed(2) }}</span>
              </div>
              <strong>\${{ (item.price * item.quantity).toFixed(2) }}</strong>
            </div>

            <div class="summary-divider"></div>
            <div class="d-flex justify-content-between">
              <span>Subtotal: \${{ selectedOrder.subtotal.toFixed(2) }}</span>
              <span>Discount: -\${{ selectedOrder.discountAmount.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-content-between fw-bold mt-1 fs-5">
              <span>Total Paid:</span>
              <span class="text-primary">\${{ selectedOrder.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Address Modal -->
      <div class="modal-overlay" *ngIf="showAddressModal" (click)="showAddressModal = false">
        <div class="modal-card card" (click)="$event.stopPropagation()">
          <h3>Add New Delivery Address</h3>
          <form (ngSubmit)="saveNewAddress()">
            <div class="form-group mt-3">
              <label class="form-label">Full Name</label>
              <input type="text" [(ngModel)]="newAddr.fullName" name="fullName" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="tel" [(ngModel)]="newAddr.phone" name="phone" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Street Address</label>
              <input type="text" [(ngModel)]="newAddr.street" name="street" class="form-control" required />
            </div>
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">City</label>
                <input type="text" [(ngModel)]="newAddr.city" name="city" class="form-control" required />
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Postal Code</label>
                <input type="text" [(ngModel)]="newAddr.postalCode" name="postalCode" class="form-control" required />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="showAddressModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Address</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <ng-template #guestView>
      <div class="container text-center py-5">
        <h2>Please sign in to view your account details</h2>
        <a routerLink="/login" class="btn btn-primary mt-3">Sign In Now</a>
      </div>
    </ng-template>
  `,
  styles: [`
    .account-page { padding: 2.5rem 1.5rem; }
    .account-layout { display: grid; grid-template-columns: 260px 1fr; gap: 2rem; align-items: start; }

    .account-sidebar { padding: 1.5rem; }
    .user-profile-summary { text-align: center; padding-bottom: 1.25rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--slate-200); }
    .profile-avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; margin-bottom: 0.75rem; }
    .user-profile-summary h3 { font-size: 1.1rem; font-weight: 800; color: var(--slate-900); }

    .sidebar-nav { display: flex; flex-direction: column; gap: 0.4rem; }
    .sidebar-nav button {
      width: 100%;
      text-align: left;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--slate-700);
      background: transparent;
    }
    .sidebar-nav button.active { background: var(--primary-50); color: var(--primary-700); }
    .logout-btn { color: var(--accent-rose) !important; margin-top: 1rem; }

    .account-content { padding: 2rem; }
    .content-heading { font-size: 1.35rem; font-weight: 800; color: var(--slate-900); margin-bottom: 0.25rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mt-3 { margin-top: 1rem; }
    .form-row { display: flex; gap: 1rem; }
    .flex-1 { flex: 1; }

    /* Orders Tab */
    .order-item-card { padding: 1.25rem; margin-bottom: 1rem; border: 1px solid var(--slate-200); }
    .order-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .order-date { display: block; font-size: 0.8rem; color: var(--slate-400); }
    .order-items-preview { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
    .preview-thumb { position: relative; width: 48px; height: 48px; border-radius: var(--radius-sm); overflow: hidden; }
    .preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .preview-thumb span { position: absolute; bottom: 0; right: 0; background: rgba(0,0,0,0.7); color: #fff; font-size: 0.65rem; padding: 1px 4px; }
    .order-card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
    .payment-tag { font-size: 0.75rem; color: var(--slate-400); margin-left: 0.5rem; }

    /* Wishlist Grid */
    .wishlist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1.5rem; }

    /* Address Cards */
    .address-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
    .address-card { padding: 1.25rem; position: relative; }
    .delete-addr-btn { color: var(--accent-rose); font-size: 0.8rem; font-weight: bold; margin-top: 0.75rem; }

    /* Modals */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .modal-card { width: 100%; max-width: 500px; padding: 2rem; max-height: 90vh; overflow-y: auto; }
    .order-modal { max-width: 600px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .modal-header button { font-size: 1.5rem; }
    .modal-item-row { display: flex; align-items: center; gap: 0.75rem; font-size: 0.88rem; margin-bottom: 0.75rem; }
    .modal-item-row img { width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }

    @media (max-width: 900px) {
      .account-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class AccountComponent implements OnInit {
  user: User | null = null;
  activeTab: 'profile' | 'orders' | 'wishlist' | 'addresses' = 'profile';

  profileData: Partial<User> = {};
  orders$!: Observable<Order[]>;
  wishlist$!: Observable<WishlistItem[]>;

  selectedOrder?: Order;
  showAddressModal = false;
  newAddr: Partial<Address> = { fullName: '', phone: '', street: '', city: '', postalCode: '' };

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private wishlistService: WishlistService,
    private notification: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.user = u;
      if (u) {
        this.profileData = { ...u };
        this.orders$ = this.orderService.getUserOrders(u.id);
      }
    });

    this.wishlist$ = this.wishlistService.wishlist$;

    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  updateProfile() {
    this.authService.updateProfile(this.profileData);
  }

  logout() {
    this.authService.logout();
  }

  saveNewAddress() {
    if (this.newAddr.fullName && this.newAddr.street && this.newAddr.city) {
      this.authService.addSavedAddress(this.newAddr as Address);
      this.showAddressModal = false;
      this.newAddr = {};
    }
  }

  deleteAddress(id: string) {
    this.authService.deleteSavedAddress(id);
  }
}
