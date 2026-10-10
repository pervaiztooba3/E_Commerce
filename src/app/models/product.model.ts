export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductSpecification {
  [key: string]: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  stock: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  tags?: string[];
  specifications?: ProductSpecification;
  reviews?: ProductReview[];
}
