import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'ecommerce_products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  private initialProducts: Product[] = [
    {
      id: 'prod-101',
      title: 'AuraSound Pro Wireless Noise Cancelling Headphones',
      price: 249.99,
      originalPrice: 329.99,
      discountPercentage: 24,
      rating: 4.8,
      reviewCount: 342,
      category: 'Electronics',
      description: 'Experience ultra-immersive audio with spatial acoustic processing, active hybrid noise cancellation up to 45dB, and an ergonomic memory foam headband. Offers up to 50 hours of wireless playback.',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#0F172A', '#E2E8F0', '#94A3B8'],
      stock: 45,
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      tags: ['audio', 'wireless', 'headphones', 'premium'],
      specifications: {
        'Battery Life': '50 Hours',
        'Bluetooth Version': '5.3',
        'Noise Cancellation': 'Hybrid Active ANC',
        'Weight': '250g'
      },
      reviews: [
        { id: 'r1', userName: 'Alex Turner', rating: 5, comment: 'Best noise cancelling headphones I have owned. Crisp highs and deep bass.', date: '2026-09-12' },
        { id: 'r2', userName: 'Sophia Chen', rating: 4, comment: 'Super comfortable for long study sessions.', date: '2026-09-28' }
      ]
    },
    {
      id: 'prod-102',
      title: 'ChronoMax Precision Ceramic Smartwatch',
      price: 189.50,
      originalPrice: 249.00,
      discountPercentage: 24,
      rating: 4.7,
      reviewCount: 198,
      category: 'Electronics',
      description: 'Engineered with sapphire glass crystal, continuous ECG & SPO2 health tracking, offline GPS mapping, and 50m water resistance for athletic performance tracking.',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#1E293B', '#D97706'],
      sizes: ['40mm', '44mm'],
      stock: 28,
      isFeatured: true,
      isTrending: true,
      isNewArrival: true,
      tags: ['smartwatch', 'fitness', 'tech'],
      specifications: {
        'Display': '1.4" AMOLED 454x454',
        'Waterproof Rating': '5 ATM',
        'Sensors': 'Optical Heart Rate, SpO2, ECG, Accelerometer'
      }
    },
    {
      id: 'prod-103',
      title: 'Minimalist Luxe Italian Leather Crossbody Bag',
      price: 129.00,
      originalPrice: 175.00,
      discountPercentage: 26,
      rating: 4.9,
      reviewCount: 115,
      category: 'Fashion',
      description: 'Handcrafted from full-grain Florentine calfskin leather with polished brass hardware, magnetic flap closure, and customized organizer compartments.',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#78350F', '#000000', '#D97706'],
      stock: 14,
      isFeatured: true,
      isTrending: false,
      isNewArrival: true,
      tags: ['leather', 'bag', 'handbag', 'luxury'],
      specifications: {
        'Material': '100% Genuine Italian Calfskin',
        'Dimensions': '24 x 18 x 7 cm',
        'Strap Length': 'Adjustable 110-135 cm'
      }
    },
    {
      id: 'prod-104',
      title: 'Nordic Artisan Handcrafted Ceramic Coffee Set',
      price: 64.99,
      originalPrice: 85.00,
      discountPercentage: 23,
      rating: 4.6,
      reviewCount: 87,
      category: 'Home & Kitchen',
      description: 'Set of 4 matte ceramic mugs with matching bamboo coasters and ceramic pour-over dripper. Dishwasher and microwave safe.',
      images: [
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#F1F5F9', '#475569', '#78350F'],
      stock: 60,
      isFeatured: false,
      isTrending: true,
      isNewArrival: false,
      tags: ['coffee', 'ceramic', 'kitchen', 'home'],
      specifications: {
        'Capacity': '350 ml per mug',
        'Material': 'Stoneware Ceramic',
        'Dishwasher Safe': 'Yes'
      }
    },
    {
      id: 'prod-105',
      title: 'Botanical Glow Radiance Facial Serum with Vitamin C',
      price: 45.00,
      originalPrice: 60.00,
      discountPercentage: 25,
      rating: 4.9,
      reviewCount: 420,
      category: 'Beauty & Care',
      description: 'Organic botanical serum blended with 15% pure L-Ascorbic Acid, Hyaluronic Acid, and Ferulic Acid to brighten skin tone and combat environmental oxidative stress.',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1608248597261-833258657640?w=800&auto=format&fit=crop&q=80'
      ],
      stock: 85,
      isFeatured: true,
      isTrending: true,
      isNewArrival: true,
      tags: ['skincare', 'serum', 'vitamin c', 'beauty'],
      specifications: {
        'Volume': '30 ml / 1 fl. oz',
        'Skin Type': 'All Skin Types',
        'Cruelty Free': 'Yes'
      }
    },
    {
      id: 'prod-106',
      title: 'ApexCore Ergonomic Mesh Task Chair',
      price: 299.00,
      originalPrice: 399.00,
      discountPercentage: 25,
      rating: 4.7,
      reviewCount: 154,
      category: 'Home & Kitchen',
      description: 'Engineered for all-day posture support with 4D adjustable armrests, dynamic lumbar support, breathable Korean mesh backrest, and heavy-duty aluminium base.',
      images: [
        'https://images.unsplash.com/photo-1580481072645-022f9a6d85d5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#0F172A', '#64748B'],
      stock: 19,
      isFeatured: true,
      isTrending: false,
      isNewArrival: false,
      tags: ['furniture', 'chair', 'office', 'ergonomic'],
      specifications: {
        'Max Weight Capacity': '150 kg',
        'Recline Angle': '90° - 135°',
        'Warranty': '5 Years'
      }
    },
    {
      id: 'prod-107',
      title: 'ProFlex Ultra Non-Slip Eco Yoga Mat',
      price: 52.00,
      originalPrice: 70.00,
      discountPercentage: 26,
      rating: 4.8,
      reviewCount: 210,
      category: 'Sports & Fitness',
      description: 'Made from sustainably harvested natural tree rubber with an anti-microbial alignment grid top surface. Provides superior joint cushioning and non-slip traction.',
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#0D9488', '#8B5CF6', '#EC4899'],
      stock: 50,
      isFeatured: false,
      isTrending: true,
      isNewArrival: true,
      tags: ['yoga', 'fitness', 'mat', 'eco'],
      specifications: {
        'Dimensions': '183cm x 68cm x 5mm',
        'Material': 'Natural Tree Rubber & Polyurethane',
        'Weight': '2.4 kg'
      }
    },
    {
      id: 'prod-108',
      title: 'Velocity Pro Running Sneakers',
      price: 139.99,
      originalPrice: 180.00,
      discountPercentage: 22,
      rating: 4.6,
      reviewCount: 275,
      category: 'Fashion',
      description: 'Designed with carbon fiber responsive plate propulsion, ultra-light nitrogen injected foam midsole, and breathable engineered knit upper.',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#EF4444', '#3B82F6', '#10B981'],
      sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
      stock: 32,
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      tags: ['shoes', 'sneakers', 'running', 'fashion'],
      specifications: {
        'Arch Support': 'Neutral to Medium',
        'Drop Height': '8mm',
        'Upper Material': 'Engineered FlyKnit'
      }
    },
    {
      id: 'prod-109',
      title: 'Lumina 4K Portable Laser Projector',
      price: 499.00,
      originalPrice: 699.00,
      discountPercentage: 29,
      rating: 4.9,
      reviewCount: 88,
      category: 'Electronics',
      description: 'Cinema quality 2200 ANSI Lumens brightness, built-in Android TV 11, Harman Kardon dual speakers, and auto keystone focus correction up to 150 inches.',
      images: [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#334155'],
      stock: 12,
      isFeatured: true,
      isTrending: false,
      isNewArrival: true,
      tags: ['projector', 'cinema', 'electronics', '4k'],
      specifications: {
        'Resolution': '4K UHD (3840 x 2160)',
        'Brightness': '2200 ANSI Lumens',
        'Connectivity': 'WiFi 6, HDMI 2.1, Bluetooth 5.2'
      }
    },
    {
      id: 'prod-110',
      title: 'Organic Wool Knitted Oversized Sweater',
      price: 89.00,
      originalPrice: 120.00,
      discountPercentage: 26,
      rating: 4.5,
      reviewCount: 94,
      category: 'Fashion',
      description: 'Luxuriously soft Merino wool cable knit sweater with relaxed drop shoulders, ribbed collar and cuffs. Sustainably sourced certified organic wool.',
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#FEF3C7', '#9CA3AF', '#1E293B'],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 40,
      isFeatured: false,
      isTrending: true,
      isNewArrival: true,
      tags: ['clothing', 'sweater', 'wool', 'winter'],
      specifications: {
        'Material': '100% Merino Wool',
        'Care Instructions': 'Hand wash cold or dry clean'
      }
    },
    {
      id: 'prod-111',
      title: 'HydroCell Smart Thermal Insulation Water Bottle',
      price: 38.50,
      originalPrice: 50.00,
      discountPercentage: 23,
      rating: 4.7,
      reviewCount: 312,
      category: 'Sports & Fitness',
      description: 'Keep beverages piping hot for 24 hours or ice cold for 48 hours. Built-in LED touch lid displays real-time liquid temperature.',
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop&q=80'
      ],
      colors: ['#0284C7', '#111827', '#E11D48'],
      stock: 95,
      isFeatured: false,
      isTrending: true,
      isNewArrival: false,
      tags: ['water bottle', 'fitness', 'hydro', 'smart'],
      specifications: {
        'Capacity': '750 ml / 25 oz',
        'Material': '18/8 Food-Grade Stainless Steel',
        'BPA Free': 'Yes'
      }
    },
    {
      id: 'prod-112',
      title: 'Celestial Hydration Night Cream & Sleep Mask',
      price: 58.00,
      originalPrice: 78.00,
      discountPercentage: 26,
      rating: 4.8,
      reviewCount: 167,
      category: 'Beauty & Care',
      description: 'Overnight intensive renewal treatment packed with peptides, squalane, and lavender essence for deep skin repair during sleep.',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80'
      ],
      stock: 42,
      isFeatured: false,
      isTrending: false,
      isNewArrival: true,
      tags: ['beauty', 'cream', 'skincare', 'night'],
      specifications: {
        'Volume': '50 ml / 1.7 oz',
        'Active Ingredients': 'Triple Peptides, Squalane, Ceramides'
      }
    }
  ];

  constructor() {
    this.loadProducts();
  }

  private loadProducts() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.productsSubject.next(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse stored products', e);
      }
    }
    // Set initial mock data if missing
    this.saveProducts(this.initialProducts);
  }

  private saveProducts(products: Product[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.isFeatured))
    );
  }

  getTrendingProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.isTrending))
    );
  }

  getNewArrivals(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.isNewArrival))
    );
  }

  getRelatedProducts(category: string, currentProductId: string, limit = 4): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products
        .filter(p => p.category === category && p.id !== currentProductId)
        .slice(0, limit)
      )
    );
  }

  filterProducts(
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    rating?: number,
    sortBy?: string
  ): Observable<Product[]> {
    return this.products$.pipe(
      map(products => {
        let result = [...products];

        if (search && search.trim() !== '') {
          const q = search.toLowerCase().trim();
          result = result.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
          );
        }

        if (category && category !== 'All') {
          result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        if (minPrice !== undefined && minPrice !== null) {
          result = result.filter(p => p.price >= minPrice);
        }

        if (maxPrice !== undefined && maxPrice !== null) {
          result = result.filter(p => p.price <= maxPrice);
        }

        if (rating !== undefined && rating !== null && rating > 0) {
          result = result.filter(p => p.rating >= rating);
        }

        if (sortBy) {
          switch (sortBy) {
            case 'price-asc':
              result.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              result.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              result.sort((a, b) => b.rating - a.rating);
              break;
            case 'newest':
              result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
              break;
            case 'popularity':
            default:
              result.sort((a, b) => b.reviewCount - a.reviewCount);
              break;
          }
        }

        return result;
      })
    );
  }

  // Admin Actions
  addProduct(productData: Omit<Product, 'id'>): Product {
    const current = this.productsSubject.value;
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now().toString(36)
    };
    const updated = [newProduct, ...current];
    this.saveProducts(updated);
    return newProduct;
  }

  updateProduct(updatedProduct: Product): void {
    const current = this.productsSubject.value;
    const index = current.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = updatedProduct;
      this.saveProducts(updated);
    }
  }

  deleteProduct(id: string): void {
    const current = this.productsSubject.value;
    const updated = current.filter(p => p.id !== id);
    this.saveProducts(updated);
  }
}
