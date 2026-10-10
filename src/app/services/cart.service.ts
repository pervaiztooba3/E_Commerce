import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartSummary } from '../models/cart.model';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'ecommerce_cart';
  private readonly COUPON_KEY = 'ecommerce_applied_coupon';

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  private appliedCouponSubject = new BehaviorSubject<{ code: string; discountPercent: number } | null>(null);
  appliedCoupon$ = this.appliedCouponSubject.asObservable();

  constructor(private notification: NotificationService) {
    this.loadCart();
  }

  private loadCart() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.cartSubject.next(parsed);
        }
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    const storedCoupon = localStorage.getItem(this.COUPON_KEY);
    if (storedCoupon) {
      try {
        this.appliedCouponSubject.next(JSON.parse(storedCoupon));
      } catch (e) {
        console.error('Failed to parse coupon', e);
      }
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.cartSubject.next(items);
  }

  addToCart(product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) {
    const current = this.cartSubject.value;
    const index = current.findIndex(item =>
      item.product.id === product.id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
    );

    let updated: CartItem[];
    if (index !== -1) {
      updated = [...current];
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + quantity
      };
    } else {
      updated = [...current, { product, quantity, selectedColor, selectedSize }];
    }

    this.saveCart(updated);
    this.notification.success(`"${product.title}" added to shopping cart!`, 'Cart Updated');
  }

  updateQuantity(productId: string, quantity: number, selectedColor?: string, selectedSize?: string) {
    if (quantity <= 0) {
      this.removeFromCart(productId, selectedColor, selectedSize);
      return;
    }

    const current = this.cartSubject.value;
    const updated = current.map(item => {
      if (
        item.product.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
      ) {
        return { ...item, quantity };
      }
      return item;
    });

    this.saveCart(updated);
  }

  removeFromCart(productId: string, selectedColor?: string, selectedSize?: string) {
    const current = this.cartSubject.value;
    const itemToRemove = current.find(item =>
      item.product.id === productId &&
      (!selectedColor || item.selectedColor === selectedColor) &&
      (!selectedSize || item.selectedSize === selectedSize)
    );

    const updated = current.filter(item => !(
      item.product.id === productId &&
      (!selectedColor || item.selectedColor === selectedColor) &&
      (!selectedSize || item.selectedSize === selectedSize)
    ));

    this.saveCart(updated);
    if (itemToRemove) {
      this.notification.info(`Removed "${itemToRemove.product.title}" from cart.`);
    }
  }

  clearCart() {
    this.saveCart([]);
    this.removeCoupon();
  }

  getCartCount(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }

  applyCoupon(code: string, discountPercent: number): boolean {
    const couponData = { code, discountPercent };
    this.appliedCouponSubject.next(couponData);
    localStorage.setItem(this.COUPON_KEY, JSON.stringify(couponData));
    this.notification.success(`Coupon "${code}" applied successfully! (${discountPercent}% off)`, 'Promo Code Applied');
    return true;
  }

  removeCoupon(): void {
    this.appliedCouponSubject.next(null);
    localStorage.removeItem(this.COUPON_KEY);
  }

  getCartSummary(): CartSummary {
    const items = this.cartSubject.value;
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const coupon = this.appliedCouponSubject.value;
    let discount = 0;
    if (coupon && subtotal > 0) {
      discount = (subtotal * coupon.discountPercent) / 100;
    }

    // Free shipping for orders subtotal over $100, otherwise $15 standard shipping
    const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15.00;
    const tax = (subtotal - discount) * 0.05; // 5% estimated tax
    const total = Math.max(0, subtotal - discount + shipping + tax);

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      appliedCoupon: coupon ? coupon.code : undefined
    };
  }
}
