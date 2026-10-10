import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order, OrderStatus } from '../models/order.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly STORAGE_KEY = 'ecommerce_orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  private initialOrders: Order[] = [
    {
      id: 'ORD-98213',
      userId: 'usr-customer-1',
      customerName: 'John Doe',
      customerEmail: 'user@shop.com',
      customerPhone: '+1 (555) 234-5678',
      shippingAddress: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      items: [
        {
          productId: 'prod-101',
          title: 'AuraSound Pro Wireless Noise Cancelling Headphones',
          price: 249.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          selectedColor: '#0F172A'
        }
      ],
      subtotal: 249.99,
      shippingFee: 0,
      discountAmount: 25.00,
      total: 236.24,
      paymentMethod: 'card',
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      createdAt: '2026-10-02T14:30:00.000Z',
      trackingNumber: 'TRK-883921004',
      estimatedDelivery: '2026-10-10'
    },
    {
      id: 'ORD-97410',
      userId: 'usr-customer-1',
      customerName: 'John Doe',
      customerEmail: 'user@shop.com',
      customerPhone: '+1 (555) 234-5678',
      shippingAddress: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      items: [
        {
          productId: 'prod-104',
          title: 'Nordic Artisan Handcrafted Ceramic Coffee Set',
          price: 64.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
          selectedColor: '#F1F5F9'
        }
      ],
      subtotal: 64.99,
      shippingFee: 15.00,
      discountAmount: 0,
      total: 83.24,
      paymentMethod: 'cod',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
      createdAt: '2026-10-06T09:15:00.000Z',
      trackingNumber: 'TRK-109384772',
      estimatedDelivery: '2026-10-12'
    }
  ];

  constructor(private notification: NotificationService) {
    this.loadOrders();
  }

  private loadOrders() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.ordersSubject.next(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse stored orders', e);
      }
    }
    this.saveOrders(this.initialOrders);
  }

  private saveOrders(orders: Order[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return this.orders$.pipe(
      map(orders => orders.filter(o => o.userId === userId))
    );
  }

  getOrderById(orderId: string): Observable<Order | undefined> {
    return this.orders$.pipe(
      map(orders => orders.find(o => o.id === orderId))
    );
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'orderStatus' | 'trackingNumber'>): Order {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingDigits = Math.floor(100000000 + Math.random() * 900000000);

    const newOrder: Order = {
      ...orderData,
      id: `ORD-${randomDigits}`,
      createdAt: new Date().toISOString(),
      orderStatus: 'Pending',
      trackingNumber: `TRK-${trackingDigits}`,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const current = this.ordersSubject.value;
    const updated = [newOrder, ...current];
    this.saveOrders(updated);

    this.notification.success(`Order ${newOrder.id} placed successfully!`, 'Order Placed');
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const current = this.ordersSubject.value;
    const index = current.findIndex(o => o.id === orderId);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = {
        ...updated[index],
        orderStatus: status,
        paymentStatus: status === 'Delivered' ? 'Paid' : updated[index].paymentStatus
      };
      this.saveOrders(updated);
      this.notification.success(`Order ${orderId} status updated to ${status}`, 'Status Updated');
    }
  }

  // Admin metrics
  getAdminStats() {
    return this.orders$.pipe(
      map(orders => {
        const totalSales = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
        return { totalSales, totalOrders, pendingOrders };
      })
    );
  }
}
