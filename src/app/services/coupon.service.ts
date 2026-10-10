import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coupon } from '../models/coupon.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private readonly STORAGE_KEY = 'ecommerce_coupons';
  private couponsSubject = new BehaviorSubject<Coupon[]>([]);
  coupons$ = this.couponsSubject.asObservable();

  private initialCoupons: Coupon[] = [
    {
      code: 'SAVE10',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 50,
      isActive: true,
      description: '10% OFF orders over $50'
    },
    {
      code: 'WELCOME20',
      discountType: 'percentage',
      discountValue: 20,
      minPurchase: 100,
      isActive: true,
      description: '20% OFF for new store customers over $100'
    },
    {
      code: 'FREESHIP',
      discountType: 'percentage',
      discountValue: 15,
      minPurchase: 30,
      isActive: true,
      description: '15% OFF discount on purchases over $30'
    }
  ];

  constructor(private notification: NotificationService) {
    this.loadCoupons();
  }

  private loadCoupons() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.couponsSubject.next(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse coupons', e);
      }
    }
    this.saveCoupons(this.initialCoupons);
  }

  private saveCoupons(coupons: Coupon[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(coupons));
    this.couponsSubject.next(coupons);
  }

  getCoupons(): Observable<Coupon[]> {
    return this.coupons$;
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; message: string } {
    const coupons = this.couponsSubject.value;
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!found) {
      return { valid: false, message: 'Invalid promo code.' };
    }

    if (!found.isActive) {
      return { valid: false, message: 'This coupon code has expired.' };
    }

    if (subtotal < found.minPurchase) {
      return { valid: false, message: `Minimum purchase of $${found.minPurchase} required for code ${found.code}.` };
    }

    return { valid: true, coupon: found, message: 'Coupon applied successfully!' };
  }

  addCoupon(coupon: Coupon): void {
    const current = this.couponsSubject.value;
    const exists = current.some(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (exists) {
      this.notification.error('Coupon code already exists.', 'Error');
      return;
    }

    const updated = [...current, coupon];
    this.saveCoupons(updated);
    this.notification.success(`Coupon ${coupon.code} created!`, 'Coupon Created');
  }

  toggleCouponStatus(code: string): void {
    const current = this.couponsSubject.value;
    const index = current.findIndex(c => c.code === code);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = { ...updated[index], isActive: !updated[index].isActive };
      this.saveCoupons(updated);
      this.notification.info(`Coupon ${code} status changed.`);
    }
  }

  deleteCoupon(code: string): void {
    const current = this.couponsSubject.value;
    const updated = current.filter(c => c.code !== code);
    this.saveCoupons(updated);
    this.notification.info(`Coupon ${code} deleted.`);
  }
}
