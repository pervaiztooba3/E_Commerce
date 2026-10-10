import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly STORAGE_KEY = 'ecommerce_categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  private initialCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'Electronics',
      slug: 'electronics',
      icon: 'device-laptop',
      image: 'https://images.unsplash.com/photo-1498049860654-af1a5c57abf3?w=600&auto=format&fit=crop&q=80',
      itemCount: 42,
      description: 'Audio, smartwatches, 4K projectors, headphones and gadgets.'
    },
    {
      id: 'cat-2',
      name: 'Fashion',
      slug: 'fashion',
      icon: 'shirt',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
      itemCount: 86,
      description: 'Designer outerwear, Italian leather bags, and high-performance footwear.'
    },
    {
      id: 'cat-3',
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      icon: 'home',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
      itemCount: 54,
      description: 'Ergonomic task chairs, ceramic coffee sets, and minimalist home decor.'
    },
    {
      id: 'cat-4',
      name: 'Beauty & Care',
      slug: 'beauty-care',
      icon: 'sparkles',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
      itemCount: 38,
      description: 'Organic Vitamin C serums, nighttime hydration masks, and organic skincare.'
    },
    {
      id: 'cat-5',
      name: 'Sports & Fitness',
      slug: 'sports-fitness',
      icon: 'activity',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      itemCount: 29,
      description: 'Eco-friendly tree rubber yoga mats, smart thermal bottles, and workout gear.'
    }
  ];

  constructor() {
    this.loadCategories();
  }

  private loadCategories() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.categoriesSubject.next(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse categories', e);
      }
    }
    this.saveCategories(this.initialCategories);
  }

  private saveCategories(categories: Category[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    this.categoriesSubject.next(categories);
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  addCategory(categoryData: Omit<Category, 'id'>): Category {
    const current = this.categoriesSubject.value;
    const newCategory: Category = {
      ...categoryData,
      id: 'cat-' + Date.now().toString(36)
    };
    const updated = [...current, newCategory];
    this.saveCategories(updated);
    return newCategory;
  }

  updateCategory(updatedCategory: Category): void {
    const current = this.categoriesSubject.value;
    const index = current.findIndex(c => c.id === updatedCategory.id);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = updatedCategory;
      this.saveCategories(updated);
    }
  }

  deleteCategory(id: string): void {
    const current = this.categoriesSubject.value;
    const updated = current.filter(c => c.id !== id);
    this.saveCategories(updated);
  }
}
