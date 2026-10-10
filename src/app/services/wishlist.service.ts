import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WishlistItem } from '../models/wishlist.model';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'ecommerce_wishlist';
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(private notification: NotificationService) {
    this.loadWishlist();
  }

  private loadWishlist() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.wishlistSubject.next(parsed);
        }
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
  }

  private saveWishlist(items: WishlistItem[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.wishlistSubject.next(items);
  }

  toggleWishlist(product: Product): boolean {
    const current = this.wishlistSubject.value;
    const exists = current.some(item => item.product.id === product.id);

    if (exists) {
      this.removeFromWishlist(product.id);
      return false;
    } else {
      const newItem: WishlistItem = {
        product,
        addedAt: new Date().toISOString()
      };
      const updated = [...current, newItem];
      this.saveWishlist(updated);
      this.notification.success(`Saved "${product.title}" to your Wishlist!`, 'Wishlist Updated');
      return true;
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistSubject.value.some(item => item.product.id === productId);
  }

  removeFromWishlist(productId: string) {
    const current = this.wishlistSubject.value;
    const item = current.find(i => i.product.id === productId);
    const updated = current.filter(i => i.product.id !== productId);
    this.saveWishlist(updated);

    if (item) {
      this.notification.info(`Removed "${item.product.title}" from Wishlist.`);
    }
  }

  clearWishlist() {
    this.saveWishlist([]);
  }

  getWishlistCount(): Observable<number> {
    return this.wishlist$.pipe(map(items => items.length));
  }
}
